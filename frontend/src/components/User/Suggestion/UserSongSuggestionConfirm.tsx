import { Badge, Box, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { SongSchema } from "../../../Types/SongSchema";
import { FaPaypal } from "react-icons/fa";
import Song from "../../Host/EventDashboard/Song/Song";
import { createSuggestionPayment } from "../../../APIRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { CreateSuggestionQueryProps } from "../../../Types/SuggestionSchema";
import { useState } from "react";
import { ShoppingCart } from "react-feather";

type UserSongSuggestionConfirmProps = {
    song: SongSchema,
    message: string,
    isBoosted: boolean,
    price: number,
    showConfirmation: () => void,
};

const UserSongSuggestionConfirm = ({ song, message, isBoosted, price, showConfirmation }: UserSongSuggestionConfirmProps) => {
    const { eventId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const sendSuggestion = async () => {
        if (eventId) {
            const suggestion: CreateSuggestionQueryProps = {
                songId: song.id,
                message: message,
                boosted: isBoosted,
            };

            setIsLoading(true);
            const payment = await createSuggestionPayment(price, eventId, suggestion);

            if (payment) {
                // redirect to paypal
                setIsLoading(false);
                window.location.href = payment.result.links[1].href;
            }
        } else {
            toast({
                title: "Failed to create suggestion.",
                description: "Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            navigate(`/user/song-suggest/${eventId}`);
        }
    }

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center">
            <Box justifyContent="center" alignItems="center" textAlign="center" m={8}>
                <Flex justifyContent="center" alignItems="center" mb={5} direction={"column"}>
                    <Heading textTransform="uppercase" mb={5}>Summary</Heading>
                    <Song {...song} isSelected={false} />
                </Flex>
                <Flex direction={"column"} mt={"8"} gap={"6"} justifyContent={"center"} alignItems={"center"}>
                    <Flex direction={"column"} width={"100%"}>
                        {message &&
                            <Box border="1px" borderColor="purple.300" borderRadius="md" width="100%" textAlign="center">
                                <Badge borderRadius={"md"} colorScheme="purple" fontSize={"2xl"} m={2}>Message</Badge>
                                <Text fontSize={"lg"} mb={"2"}>{message}</Text>
                            </Box>
                        }
                    </Flex>
                    <Badge borderRadius={"md"} width={"fit-content"} fontSize={isBoosted ? "2xl" : "lg"} colorScheme={isBoosted ? "orange" : "gray"} mb={"4"} >{isBoosted ? "Boosted" : "Not boosted"}</Badge>
                    <Flex justifyContent={"center"} alignItems={"center"}>
                        <Badge colorScheme="green" textAlign="center" fontSize="2xl" alignSelf={"flex-start"} borderRadius={"md"}>
                            <Box display="inline-block" mr={4} verticalAlign={"middle"} mb={"1"}>
                                <ShoppingCart />
                            </Box>
                            {price} €
                        </Badge>
                    </Flex>
                </Flex>
            </Box >

            <Flex width="100%" justifyContent="center" alignItems="center" mt={5} direction={"row"} gap={"8"}>
                <Button colorScheme="pink" size={"md"} onClick={showConfirmation}>Back</Button>
                <Button colorScheme="blue" size={"md"} onClick={sendSuggestion} isLoading={isLoading}>Pay <FaPaypal /></Button>
            </Flex>
        </Flex >
    );
};

export default UserSongSuggestionConfirm;