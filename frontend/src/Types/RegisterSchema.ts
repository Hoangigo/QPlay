import * as Yup from 'yup';

export interface RegisterFormValues {
    name: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
}

export const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
};

export const registerFormValidationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    confirmEmail: Yup.string()
        .oneOf([Yup.ref('email'), undefined], 'Emails must match')
        .required('Required'),
    password: Yup.string()
        .required('Required')
        .min(8, 'Must be 8 characters or more')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Required'),
});