import { Flex, Heading, Box, Button, FormControl, FormLabel, Input, useToast, useColorMode } from "@chakra-ui/react";
import { Formik, Field, Form, ErrorMessage, FieldProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../main";

interface FormValues {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const [params] = useSearchParams();
    const [tokenExists, setTokenExists] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { colorMode } = useColorMode();

    useEffect(() => {
        const data = {
            token: params.get("token"),
        };

        axios.post(`${BASE_URL}host/password/reset/confirm-token`, data).then((response: AxiosResponse) => {

            if (response.status === 200) {
                setTokenExists(true);
            }
        }).catch((err: AxiosError) => {
            setTokenExists(false);

            if (err.response?.status === 404) {
                toast({
                    title: "could not change password",
                    description: "your token is not valid. request denied.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/login");
            } else if (err.response?.status === 401) {
                toast({
                    title: "could not change password",
                    description: "your token is expired. request denied.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                navigate("/login");
            }
        })
    }, [setTokenExists]);

    const validationSchema = Yup.object({
        password: Yup.string()
            .required('Required')
            .min(8, 'Must be 8 characters or more')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
            .required('Required'),
    });

    const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        const data = {
            password: values.password,
            token: params.get("token"),
        };

        await axios.post(`${BASE_URL}host/password/reset`, data).then((response: AxiosResponse) => {
            actions.setSubmitting(false);
            if (response.status === 201) {
                toast({
                    title: "password changed.",
                    description: "password successfully changed",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/login');
            }
        }).catch((err: AxiosError) => {

            navigate("/login");
        })
    };

    return (
        tokenExists ?
            <Flex width="full" align="center" justifyContent="center">
                <Box p={2}>
                    <Box textAlign="center">
                        <Heading>Please set your new password</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <Formik
                            initialValues={{
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {(props: { isSubmitting: boolean | undefined; }) => (
                                <Form>
                                    <Field name="password">
                                        {({ field, form }: FieldProps<string, FormValues>) => (
                                            <FormControl isInvalid={!!form.errors.password && form.touched.password} mt={6}>
                                                <FormLabel>New password</FormLabel>
                                                <Input
                                                    type="password"
                                                    placeholder="new password"
                                                    _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                    {...field}
                                                />
                                                <ErrorMessage name="password" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="confirmPassword">
                                        {({ field, form }: FieldProps<string, FormValues>) => (
                                            <FormControl isInvalid={!!form.errors.confirmPassword && form.touched.confirmPassword} mt={6}>
                                                <FormLabel>Confirm new password</FormLabel>
                                                <Input
                                                    type="password"
                                                    placeholder="repeat new password"
                                                    _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                    {...field}
                                                />
                                                <ErrorMessage name="confirmPassword" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Button width="full" colorScheme="purple" mt={4} type="submit" isLoading={props.isSubmitting}>
                                        Set new password
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Box>
                </Box>
            </Flex>
            : <h1>Request denied</h1>
    );
}

export default ResetPassword;