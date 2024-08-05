import { Flex, Heading, Box, Button, FormControl, FormLabel, Input, Text, useToast, useColorMode } from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useFormik } from 'formik';
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../main";

const ForgotPassword = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const formik = useFormik({
        initialValues: {
            email: '',
            confirmEmail: '',
        },
        onSubmit: async values => {
            if (values.email !== values.confirmEmail) {
                alert("Emails do not match");
                return;
            }
            await axios.post(`${BASE_URL}host/password/reset-request`, values).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    toast({
                        title: "We sent a linkt to your email adress",
                        description: "Check your email adress to reset your password.",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate('/login');
                }
            }).catch((err: AxiosError) => {
                toast({
                    title: "Error while reset",
                    description: err.response?.statusText,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/login')
            });
        },
    });

    return (
        <Flex width="full" align="center" justifyContent="center" mt={"16"}>
            <Box p={2}>
                <Box textAlign="center">
                    <Heading>Reset password</Heading>
                </Box>
                <Box my={4} textAlign="left">
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="test@test.com"
                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                id="email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Confirm Email</FormLabel>
                            <Input
                                type="email"
                                placeholder="test@test.com"
                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                id="confirmEmail"
                                name="confirmEmail"
                                onChange={formik.handleChange}
                                value={formik.values.confirmEmail}
                            />
                        </FormControl>
                        <Button colorScheme="purple" width="full" mt={4} type="submit">
                            Send Reset Link
                        </Button>
                        <Flex justify="space-between" mt={4}>
                            <Text as={Link} to="/login" color={colorMode === "dark" ? "purple.300" : "purple.900"}>
                                Back to Login
                            </Text>
                            <Text as={Link} to="/register" color={colorMode === "dark" ? "purple.300" : "purple.900"}>
                                Register
                            </Text>
                        </Flex>
                    </form>
                </Box>
            </Box>
        </Flex>
    );
}

export default ForgotPassword;
