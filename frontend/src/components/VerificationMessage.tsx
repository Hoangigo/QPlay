import { Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmailConfirmation } from "../APIRoutes";


const VerificationMessage = () => {
    const [isAlreadyConfirmed, setIsAlreadyConfirmed] = useState(Boolean);
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchVerification = async () => {
            if (!params.has("id")) {
                toast({
                    title: "Verification failed.",
                    description: "No id provided.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }
            const id = params.get("id");
            const status = await verifyEmailConfirmation(id as string)
            if (status === 201) {
                setIsAlreadyConfirmed(true);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else if (status === 409) {
                setIsAlreadyConfirmed(false);
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } else {
                toast({
                    title: "Verification failed.",
                    description: `Error: ${status}`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }

        fetchVerification();
    }, [setIsAlreadyConfirmed, params]);


    return (
        <Flex direction="column" justifyContent="center" alignItems="center" height="50vh" width="100vw" p={"8"}>
            <Card m="8" width="80%" height="80%" display="flex" justifyContent="center" alignItems="center" bg={!isAlreadyConfirmed ? "purple.500" : "green.500"} color={"white"}>
                <CardHeader>
                    <Heading as="h1" size="lg" textAlign="center">
                        Verification {!isAlreadyConfirmed ? "already done" : "successful"}
                    </Heading>
                </CardHeader>
                <CardBody textAlign="center">
                    <Text fontSize="lg" fontWeight="bold">
                        {!isAlreadyConfirmed ?
                            "You have already verified your account. You will be redirected to the login page. If redirection does not happen, please click on the button below."
                            :
                            "You have successfully verified your account. You will be redirected to the login page. If redirection does not happen, please click on the button below."
                        }
                    </Text>
                </CardBody>
                <CardFooter>
                    <Button colorScheme="purple" color={"white"} onClick={() => navigate('/login')}>Login</Button>
                </CardFooter>
            </Card>
        </Flex>
    );
}

export default VerificationMessage; 