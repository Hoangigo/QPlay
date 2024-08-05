import { Flex, Heading, Box, Button, FormControl, FormLabel, Input, Text, useToast, useColorMode } from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik, Field, Form, ErrorMessage, FieldProps, FormikHelpers } from 'formik';
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../main";
import Cookies from "universal-cookie";
import { useEffect } from "react";

interface FormValues {
    email: string;
    password: string;
}

const LoginForm = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().min(6, 'Must be 6 characters or more').required('Required'),
    });
    const cookies = new Cookies();
    const { colorMode } = useColorMode();

    useEffect(() => {
        if (cookies.get('jwt_token') != undefined) {
            navigate('/host-dashboard/1');
        }
    }, []);



    const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        await axios.post(`${BASE_URL}host/login`, values).then((response: AxiosResponse) => {
            actions.setSubmitting(false);
            if (response.status === 201) {
                cookies.set('jwt_token', response.data.token, { path: '/' });
                cookies.set('email', response.data.email, { path: '/' });
                navigate('/host-dashboard/1');
            }
        }).catch((err: AxiosError) => {
            if (err.response?.status === 401 || err.response?.status === 404) {
                toast({
                    title: "Login Failed",
                    description: "Wrong email or password",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Unknown Error",
                    description: "Please try again later",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }).then(() => {
            if (cookies.get('jwt_token') != undefined) {

                axios.defaults.headers.common = { 'Authorization': `Bearer ${cookies.get('jwt_token')}` }
            }
        })
    };

    return (
        <Flex width="full" align="center" justifyContent="center" mt={"16"}>
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Login</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {(props: { isSubmitting: boolean | undefined; }) => (
                            <Form>
                                <Field name="email">
                                    {({ field, form }: FieldProps<string, FormValues>) => (
                                        <FormControl isInvalid={!!form.errors.email && form.touched.email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                type="email"
                                                placeholder="test@test.com"
                                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                {...field}
                                            />
                                            <ErrorMessage name="email" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ field, form }: FieldProps<string, FormValues>) => (
                                        <FormControl isInvalid={!!form.errors.password && form.touched.password} mt={6}>
                                            <FormLabel>Password</FormLabel>
                                            <Input
                                                type="password"
                                                placeholder="*******"
                                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                {...field}
                                            />
                                            <ErrorMessage name="password" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Button width="full" mt={4} type="submit" isLoading={props.isSubmitting} colorScheme="purple">
                                    Login
                                </Button>
                                <Flex justify="space-between" mt={4}>
                                    <Text as={Link} to="/forgot-password" color={colorMode === "dark" ? "purple.300" : "purple.900"}>
                                        Forgot password
                                    </Text>
                                    <Text as={Link} to="/register" color={colorMode === "dark" ? "purple.300" : "purple.900"}>
                                        Register
                                    </Text>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Flex>
    );
}

export default LoginForm;
