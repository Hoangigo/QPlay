import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import { BASE_URL } from "../../main";


const Auth = ({ children }: any) => {
    const navigate = useNavigate();
    let cookies = new Cookies();

    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {
            if (cookies.get('jwt_token') === undefined || cookies.get('email') === undefined) {
                //token not set, navigate to login
                console.error("Undefined cookies redirect");
                navigate('/login');
                return;
            };
            await axios.post(`${BASE_URL}auth/verify/token`, cookies.getAll()).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    //token okay, do nothing
                }
            }).catch((err: AxiosError) => {
                //token is not valid, delete cookies and go to login
                //cookiesTest.set('tokenIsVerified', false, { path: '/' });
                cookies.remove('jwt_token', { path: '/' });
                cookies.remove('email', { path: '/' });
                console.error(Error, err.message);
                navigate('/login');
            }).then(() => {
                if (cookies.get('jwt_token') != undefined) {

                    axios.defaults.headers.common = { 'Authorization': `Bearer ${cookies.get('jwt_token')}` }
                }
            })
        }

        fetchData().catch(console.error);
    }, [navigate])

    return children;
}

export default Auth;