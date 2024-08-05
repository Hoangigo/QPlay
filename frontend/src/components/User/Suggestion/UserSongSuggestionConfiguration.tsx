import { Button, Flex, Heading, Textarea, Box, Switch, Badge, useColorMode } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import UserSongSuggestionConfirm from "./UserSongSuggestionConfirm";
import { SongSchema } from "../../../Types/SongSchema";
import { ShoppingCart } from "react-feather";

type UserSongSuggestionConfigurationProps = {
    song: SongSchema,
    price: number,
    showConfiguration: () => void,
    messagePrice: number,
};

const UserSongSuggestionConfiguration = ({ song, price, showConfiguration, messagePrice }: UserSongSuggestionConfigurationProps) => {
    const [suggestionMessage, setSuggestionMessage] = useState("");
    const [currentPrice, setCurrentPrice] = useState(price);
    const [isBoosted, setIsBoosted] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { colorMode } = useColorMode();
    const BOOSTED_PRICE = 5;

    const handleSuggestionMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const currentTargetValue = event.currentTarget.value;
        if (currentTargetValue) {
            setCurrentPrice(price + messagePrice);
        } else {
            setCurrentPrice(currentPrice - messagePrice);
        }
        setSuggestionMessage(currentTargetValue);
    }

    const handleBoostedSuggestion = (event: ChangeEvent<HTMLInputElement>) => {
        const currentTargetValue = event.currentTarget.checked;
        setIsBoosted(currentTargetValue);

        if (!isBoosted) {
            setCurrentPrice(currentPrice + BOOSTED_PRICE);
        } else {
            setCurrentPrice(currentPrice - BOOSTED_PRICE);
        }
    }

    return (
        !showConfirmation ?
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Flex justifyContent={"center"} alignItems={"center"}>
                    <Badge colorScheme="green" textAlign="center" fontSize="2xl" alignSelf={"flex-start"} borderRadius={"md"}>
                        <Box display="inline-block" mr={4} verticalAlign={"middle"} mb={"1"}>
                            <ShoppingCart />
                        </Box>
                        {currentPrice} €
                    </Badge>
                </Flex>
                <Box justifyContent="center" alignItems="center" textAlign="center" mt={10}>
                    <Heading textTransform="uppercase" color={messagePrice === 0 ? "grey" : "white"} >Add a message</Heading>
                    <Textarea
                        placeholder="Enter here your message..."
                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                        defaultValue={suggestionMessage}
                        resize="none"
                        width="90%"
                        disabled={messagePrice === 0 ? true : false}
                        mt={5}
                        onChange={(event) => handleSuggestionMessage(event)}
                    />
                </Box>
                <Box justifyContent="center" alignItems="center" textAlign="center" mt={10}>
                    <Heading textTransform="uppercase">Boost suggestion</Heading>
                    <Switch
                        size="lg"
                        mt={5}
                        colorScheme={isBoosted ? "orange" : "purple"}
                        isChecked={isBoosted}
                        onChange={(event) => handleBoostedSuggestion(event)}
                    />
                </Box>
                <Flex width="100%" justifyContent="center" alignItems="center" mt={5} direction={"row"} gap={"8"}>
                    <Button mt={4} colorScheme="pink" size={"md"} onClick={showConfiguration}>Back</Button>
                    <Button mt={4} colorScheme="purple" size={"md"} onClick={() => setShowConfirmation(true)}>Continue</Button>
                </Flex>
            </Flex >
            : <UserSongSuggestionConfirm song={song} message={suggestionMessage} isBoosted={isBoosted} price={currentPrice} showConfirmation={() => setShowConfirmation(false)} />
    );
};

export default UserSongSuggestionConfiguration;