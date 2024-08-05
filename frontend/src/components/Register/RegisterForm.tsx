import React, { useState, useEffect } from 'react';
import { Text, Box, Button, Flex, FormControl, FormLabel, Heading, Input, useToast, useColorMode } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { Formik, Field, Form, ErrorMessage, FormikHelpers, FieldProps, FormikProps } from 'formik';
import PasswordChecklist from "react-password-checklist";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../main';
import { RegisterFormValues, initialValues, registerFormValidationSchema } from '../../Types/RegisterSchema';



const RegisterForm: React.FC = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();


    const [isValidPassword, setIsValidPassword] = useState(false);


    const handleSubmit = async (values: RegisterFormValues, actions: FormikHelpers<RegisterFormValues>) => {
        await axios.post(`${BASE_URL}host`, values).then((response) => {
            actions.setSubmitting(false);
            if (response.status === 201) {
                toast({
                    title: "Registration successful.",
                    description: "We created your account for you.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                toast({
                    title: "Please verifiy your email adress.",
                    description: "We'll sent you a link to your email adress.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/login');
            }
        }).catch((err) => {
            if (err.response.status === 409) {
                toast({
                    title: "Registration failed.",
                    description: "Email already in use.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Registration failed.",
                    description: "Error" + err,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        });
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <Flex direction="column" width="full" align="center" justifyContent="center">
            <Box textAlign="center" m={5}>
                <Heading>Register</Heading>
            </Box>
            <Formik
                initialValues={initialValues}
                validationSchema={registerFormValidationSchema}
                onSubmit={handleSubmit}
            >
                {(props: FormikProps<RegisterFormValues>) => {
                    useEffect(() => {
                        setIsValidPassword(props.isValid);
                    }, [props.values.password, props.values.confirmPassword, props.isValid]);

                    return (
                        <Form>
                            <Field name="name">
                                {({ field, form }: FieldProps<string, RegisterFormValues>) => (
                                    <FormControl isInvalid={!!form.errors.name && form.touched.name}>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <Input {...field}
                                            id="name"
                                            placeholder="Name"
                                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                            size="lg" />
                                        <ErrorMessage name="name" />
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="email">
                                {({ field, form }: FieldProps<string, RegisterFormValues>) => (
                                    <FormControl isInvalid={!!form.errors.email && form.touched.email} mt={6}>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <Input {...field}
                                            id="email"
                                            placeholder="example@example.com"
                                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                            size="lg" />
                                        <ErrorMessage name="email" />
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="confirmEmail">
                                {({ field, form }: FieldProps<string, RegisterFormValues>) => (
                                    <FormControl isInvalid={!!form.errors.confirmEmail && form.touched.confirmEmail} mt={6}>
                                        <FormLabel htmlFor="confirmEmail">Confirm Email</FormLabel>
                                        <Input {...field}
                                            id="confirmEmail"
                                            placeholder="Confirm email"
                                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                            size="lg" />
                                        <ErrorMessage name="confirmEmail" />
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="password">
                                {({ field, form }: FieldProps<string, RegisterFormValues>) => (
                                    <FormControl isInvalid={!!form.errors.password && form.touched.password} mt={6}>
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <Input {...field}
                                            id="password"
                                            type="password"
                                            placeholder="********"
                                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                            size="lg" />
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="confirmPassword">
                                {({ field, form }: FieldProps<string, RegisterFormValues>) => (
                                    <FormControl isInvalid={!!form.errors.confirmPassword && form.touched.confirmPassword} mt={6}>
                                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                        <Input {...field}
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm password"
                                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                            size="lg" />
                                    </FormControl>
                                )}
                            </Field>
                            {isValidPassword ? (
                                <Box color="green.400" mt={2}>
                                    <CheckIcon /> Password valid
                                </Box>
                            ) : (
                                <PasswordChecklist
                                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                                    minLength={8}
                                    value={props.values.password}
                                    valueAgain={props.values.confirmPassword}
                                    onChange={(isValid) => setIsValidPassword(isValid)}
                                    messages={{
                                        minLength: "Password must be at least 8 characters long.",
                                        specialChar: "Password contains a special character.",
                                        number: "Password contains a number.",
                                        capital: "Password contains an uppercase letter.",
                                    }}
                                    style={{ marginTop: '10px', fontSize: '0.8em' }}
                                />
                            )}
                            <Button width="full" mt={4} colorScheme="purple" type="submit" isLoading={props.isSubmitting}>
                                Register
                            </Button>
                            <Text
                                mt={4}
                                textAlign="center"
                                color={colorMode === "dark" ? "purple.300" : "purple.900"}
                                onClick={handleGoToLogin}
                                cursor="pointer"
                            >
                                Already registered
                            </Text>
                        </Form>
                    );
                }}
            </Formik>
        </Flex>
    );
};

export default RegisterForm;
