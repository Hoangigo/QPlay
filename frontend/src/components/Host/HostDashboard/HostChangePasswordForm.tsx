import { Box, Button, FormControl, FormLabel, Input, useColorMode, useToast } from "@chakra-ui/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Formik, Field, Form, FieldProps, FormikProps } from 'formik';
import * as Yup from "yup";
import { BASE_URL } from "../../../main";
import { useEffect, useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { CheckIcon } from "@chakra-ui/icons";
import Cookies from "universal-cookie";

interface FormValues {
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string,
};

interface HostChangePasswordFormProps {
    onClose: () => void,
};

const HostChangePasswordForm = ({ onClose }: HostChangePasswordFormProps) => {
    const toast = useToast();
    let cookies = new Cookies();
    const { colorMode } = useColorMode();
    const [isValidPassword, setIsValidPassword] = useState(false);

    const initialValues: FormValues = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    };

    const validationSchema = Yup.object({
        oldPassword: Yup.string()
            .required('Required'),
        newPassword: Yup.string()
            .required('Required')
            .min(8, 'Must be 8 characters or more')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
            .required('Required')
    });

    const handleSubmit = async (values: FormValues) => {
        if (cookies.get('email') === undefined) {
            //token not set, navigate to login
            toast({
                title: "Error while changing password",
                description: "Error cookie is not set",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        };
        await axios.post(`${BASE_URL}host/change/password/${cookies.get('email')}`, values)
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    toast({
                        title: "Password Changed",
                        description: "password changed successfully",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    onClose();
                }
            }).catch((err: AxiosError) => {
                if (err.response?.status === 401) {
                    toast({
                        title: "Change Password Failed",
                        description: "wrong password",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: "Error while changing password",
                        description: "Error" + err.response?.statusText,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {(props: FormikProps<FormValues>) => {
                useEffect(() => {
                    setIsValidPassword(props.isValid);
                }, [props.values.newPassword, props.values.confirmNewPassword, props.isValid]);

                return (
                    <Form>
                        <Field name="oldPassword">
                            {({ field, form }: FieldProps<string, FormValues>) => (
                                <FormControl isInvalid={!!form.errors.oldPassword && form.touched.oldPassword} mt={6}>
                                    <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                                    <Input {...field}
                                        id="oldPassword"
                                        type="password"
                                        placeholder="Enter your current password"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        size="lg"
                                    />
                                </FormControl>
                            )}
                        </Field>
                        <Field name="newPassword">
                            {({ field, form }: FieldProps<string, FormValues>) => (
                                <FormControl isInvalid={!!form.errors.newPassword && form.touched.newPassword} mt={6}>
                                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                    <Input {...field}
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter your new password"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        size="lg" />
                                </FormControl>
                            )}
                        </Field>
                        <Field name="confirmNewPassword">
                            {({ field, form }: FieldProps<string, FormValues>) => (
                                <FormControl isInvalid={!!form.errors.confirmNewPassword && form.touched.confirmNewPassword} mt={6}>
                                    <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
                                    <Input {...field}
                                        id="confirmNewPassword"
                                        type="password"
                                        placeholder="Confirm your new password"
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
                                value={props.values.newPassword}
                                valueAgain={props.values.confirmNewPassword}
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
                        <Button width="full" colorScheme="purple" mt={4} mb={8} type="submit">
                            Change Password
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default HostChangePasswordForm;