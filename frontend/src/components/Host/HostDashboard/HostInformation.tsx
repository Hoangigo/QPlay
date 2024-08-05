import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { VStack, Editable, EditablePreview, EditableInput, Divider, Box, IconButton, Tooltip, Button, useToast } from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons';
import { BASE_URL } from '../../../main';
import { HostSchema } from '../../../Types/HostSchema';
import HostChangePassword from './HostChangePassword';
import Cookies from "universal-cookie";
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { deleteHost } from '../../../APIRoutes';

const HostInformationData = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [host, setHost] = useState<HostSchema>(Object);
    const [editHost, setEditHost] = useState<HostSchema>(Object);
    const [showModal, setShowModal] = useState(false);
    const cookies = new Cookies();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        const fetch = async () => {
            if (cookies.get('email') === undefined) {
                //token not set, navigate to login
                console.error("Email cookie not set")
                return;
            };
            axios.get(`${BASE_URL}host/${cookies.get('email')}`)
                .then((response: AxiosResponse) => {
                    if (response.status === 200) {
                        setHost(response.data);
                        setEditHost(response.data);
                    }
                })
                .catch((error: AxiosError) => {
                    console.error("Error:", error);
                });
        }
        fetch();
    }, []);

    const openDeleteConfirmationModal = () => {
        setIsAlertOpen(true);
    }

    const handleConfirmDelete = async () => {
        setIsAlertOpen(false);
        if (cookies.get('email') === undefined) {
            return;
        }
        const deleteSuccessful: boolean = await deleteHost(cookies.get('email'));
        if (deleteSuccessful) {
            toast({
                title: "Account deleted",
                description: "Your account has been deleted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            cookies.remove('jwt_token', { path: '/' });
            cookies.remove('email', { path: '/' });


            navigate('/login');
        } else {
            toast({
                title: "Error: Account not deleted",
                description: "Your account has not been deleted due to an error.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }


    const handlePasswordChange = async () => {
        setShowModal(true);
    }

    const handleNameChange = async (e: string) => {
        if (host.name === editHost.name || cookies.get('email') === undefined) {
            return;
        }
        await axios.put(`${BASE_URL}host/${cookies.get('email')}`, { name: `${e}` })
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    setHost(response.data);
                    setEditHost(response.data);
                    toast({
                        title: "Changed username",
                        description: "Your username has changed.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
            .catch((error: AxiosError) => {
                setEditHost(host);
                console.error("Error:", error);
            });
    }

    const handleEmailChange = async (e: string) => {
        if (host.email === editHost.email || cookies.get('email') === undefined) {
            return;
        }
        await axios.put(`${BASE_URL}host/${cookies.get('email')}`, { email: `${e}` })
            .then((response: AxiosResponse) => {
                if (response.status === 201) {
                    setHost(response.data);
                    setEditHost(response.data);
                    toast({
                        title: "Changed email, you will be redirected to Login",
                        description: "Your email has changed.",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    toast({
                        title: "Please verifiy your email adress",
                        description: "We'll sent you a link to your email adress.",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });
                    cookies.remove('jwt_token');
                    cookies.remove('email');
                    navigate('/login');
                }
            })
            .catch((error: AxiosError) => {
                setEditHost(host);
                console.error("Error:", error);
            });
    }

    return (
        <Box mt={"8"} shadow={"xl"} p={"4"} borderRadius={"lg"} maxW={"50vw"} minW={"40vh"}>
            <VStack spacing={4}>
                <Tooltip label="Click to edit host name" fontSize='md' placement='right-end' bg="purple.500" color="white">
                    <Editable value={editHost.name} onSubmit={(e) => handleNameChange(e)} onChange={(e) => {
                        setEditHost({
                            ...host, name: e
                        })
                    }}>
                        <EditablePreview fontSize={"2xl"} fontWeight={"bold"} />
                        <EditableInput />
                    </Editable>
                </Tooltip>
                <Divider />

                <Tooltip label="Click to edit email" fontSize='md' placement='right-end' bg="purple.500" color="white">
                    <Editable value={editHost.email} onSubmit={(e) => handleEmailChange(e)} onChange={(e) => {
                        setEditHost({
                            ...host, email: e
                        })
                    }}>
                        <EditablePreview />
                        <EditableInput />
                    </Editable>
                </Tooltip>
                <Divider />

                <Box>
                    <Button colorScheme="purple" onClick={() => handlePasswordChange()}>Change Password</Button>
                </Box>
                <Divider />

                <Tooltip label="Delete account" fontSize='md' placement='bottom' bg="red.500" color="white">
                    <IconButton cursor={"pointer"} icon={<DeleteIcon />} aria-label="Delete" colorScheme="red" onClick={openDeleteConfirmationModal}>
                        Delete
                    </IconButton>
                </Tooltip>
            </VStack>
            <HostChangePassword isOpen={showModal} onClose={() => setShowModal(false)} />
            <DeleteConfirmationDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onDelete={handleConfirmDelete}
                cancelRef={cancelRef}
                topic="account"
            />
        </Box >
    )
}

export default HostInformationData;
