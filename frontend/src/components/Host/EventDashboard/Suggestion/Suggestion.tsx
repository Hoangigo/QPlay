import { Card, CardBody, IconButton, CardFooter, Flex, Tooltip, useToast, Badge, Box, Text, useColorMode } from "@chakra-ui/react"
import { ChatIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useContext, useState } from "react";
import Song from "../Song/Song";
import { SongSchema } from "../../../../Types/SongSchema";
import { refundPayment, updateSuggestion } from "../../../../APIRoutes";
import { DashboardContext } from "../DashboardContext";
interface SuggestionProps {
    id: string;
    song: SongSchema;
    message: string;
    boosted: boolean;
    refundId: string;
    paymentId: string;
    price: number;
    showButtons: boolean;
}

const Suggestion = ({ id, song, message, boosted, refundId, paymentId, showButtons, price }: SuggestionProps) => {
    const [showMessage, setShowMessage] = useState(false)
    const toast = useToast();
    const { colorMode } = useColorMode();

    const dashboardContext = useContext(DashboardContext);
    if (!dashboardContext) {
        throw new Error("DashboardContext is undefined");
    }

    const [, setValue] = dashboardContext;

    const handleAccept = async () => {
        const data = {
            accepted: true
        };
        const response = await updateSuggestion(id, data);

        if (response) {
            toast({
                title: "Successfully accepted",
                description: "Suggestion is accepted.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setValue((prevState) => {
                return prevState + 1;
            })
        } else {
            toast({
                title: "Error while accepting",
                description: "Suggestion is not accepted. Try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleDecline = async () => {
        const response = await refundPayment(refundId, paymentId, price);

        if (response) {
            const data = {
                refunded: true,
                accepted: false,
            };
            const updateResponse = await updateSuggestion(id, data);

            if (updateResponse) {
                toast({
                    title: "Successfully declined",
                    description: "Suggestion is declined.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setValue((prevState) => {
                    return prevState + 1;
                })
            } else {
                toast({
                    title: "Error while updating refund status suggestion",
                    description: "The suggestion is not updated. Try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        } else {
            toast({
                title: "Error while declining",
                description: "Suggestion is not declined. Try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const onMessageClick = () => {
        setShowMessage((prevState) => {
            return !prevState
        })
    }

    return (
        <Card
            border="solid"
            borderColor={boosted ? "yellow.500" : "purple.500"}
            borderRadius="lg"
            bg={colorMode === "dark" ? "black" : "white"}
            minW={"25vW"}
        >
            <CardBody>
                <Song
                    name={song.name}
                    artists={song.artists}
                    images={song.images}
                    id={song.id}
                    borderColor={boosted ? "yellow.500" : "purple.500"}
                    isSelected={false}
                />
                {showMessage &&
                    <Box p={"2"} fontSize={"lg"} borderRadius={"md"} bg={boosted ? "yellow.500" : "purple.500"} mt={"2"} color={"white"}>
                        <Text textAlign={"center"} justifyContent={"center"} >
                            {message}
                        </Text>
                    </Box>
                }
            </CardBody>
            {(showButtons || message || boosted) &&
                <CardFooter>
                    <Flex gap={"16"} justifyContent="space-between" alignItems="center">
                        {message ?
                            <Tooltip label="Show message" fontSize='md' placement='bottom' bg={boosted ? "yellow.500" : "purple.500"} color="white">
                                <IconButton
                                    aria-label="Message"
                                    icon={<ChatIcon />}
                                    colorScheme={boosted ? "yellow" : "purple"}
                                    variant={"solid"}
                                    onClick={onMessageClick}
                                />
                            </Tooltip> :
                            <Box mr={"10"}></Box>
                        }

                        {boosted ?
                            <Badge colorScheme="yellow" verticalAlign="middle" fontSize={"lg"} mr={2} borderRadius={"md"}>Boosted</Badge> :
                            <Box mr={"16"}></Box>
                        }

                        {showButtons &&
                            <Flex gap="2">
                                <Tooltip label="Accept suggestion" fontSize='md' placement='bottom' bg="green.500" color="white">
                                    <IconButton
                                        aria-label="Accept"
                                        icon={<CheckIcon />}
                                        colorScheme="green"
                                        variant="outline"
                                        onClick={handleAccept}
                                    />
                                </Tooltip>
                                <Tooltip label="Decline suggestion" fontSize='md' placement='bottom' bg="red.500" color="white">
                                    <IconButton
                                        aria-label="Decline"
                                        icon={<CloseIcon />}
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={handleDecline}
                                    />
                                </Tooltip>
                            </Flex>
                        }
                    </Flex>
                </CardFooter>

            }
        </Card >
    )

}

export default Suggestion
