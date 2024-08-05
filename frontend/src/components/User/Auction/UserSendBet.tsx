import { Badge, Box, Button, Flex, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useColorMode, useToast } from "@chakra-ui/react";
import { createBetPayment, fetchSongs, getTopBet } from "../../../APIRoutes";
import { ChangeEvent, useEffect, useState } from "react";
import { SongSchema } from "../../../Types/SongSchema";
import Song from "../../Host/EventDashboard/Song/Song";
import { FaPaypal } from "react-icons/fa";
import { StarIcon } from "@chakra-ui/icons";
import { BetSchema, CreateBetQueryProps } from "../../../Types/AuctionSchema";
import CurrentBestBet from "../../Host/EventDashboard/Activity/Auction/CurrentBestBet";
import { useParams } from "react-router-dom";

type UserSendBetProps = {
    setShowSendBet: () => void,
    priceToBet: number,
    auctionId: string,
};

const UserSendBet = ({ setShowSendBet, priceToBet, auctionId }: UserSendBetProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSong, setSelectedSong] = useState<SongSchema>();
    const [spotifyResults, setSpotifyResults] = useState<SongSchema[]>();
    const [topBet, setTopBet] = useState<BetSchema>();
    const [betPrice, setBetPrice] = useState<number>(priceToBet);
    const toast = useToast();
    const { eventId } = useParams();
    const { colorMode } = useColorMode();


    useEffect(() => {
        const fetch = async () => {
            const fetchedTopBet = await getTopBet(auctionId);
            if (fetchedTopBet) {
                setTopBet(fetchedTopBet);
            }
        }
        fetch();

        const intervalId = setInterval(fetch, 2000);

        return () => clearInterval(intervalId);
    }, []);


    const selectSong = (song: SongSchema) => {
        setSelectedSong(song);
    }

    const searchForSong = async (userInput: ChangeEvent<HTMLInputElement>) => {
        const currentTargetValue: string = userInput.currentTarget.value;

        const spotifyResults = await fetchSongs(currentTargetValue, 5);
        setSpotifyResults(spotifyResults);
        setSelectedSong({} as SongSchema);
    }

    const placeBet = async () => {
        if (!selectedSong) {
            toast({
                title: "No song selected",
                description: "Please select a song",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        setIsLoading(true);

        const newBet: CreateBetQueryProps = {
            songId: selectedSong.id,
            price: betPrice,
        }

        if (eventId) {
            const payment = await createBetPayment(eventId, auctionId, newBet);

            if (payment) {
                // redirect to paypal
                setIsLoading(false);
                window.location.href = payment.result.links[1].href;
            }
        }
    }

    const setPrice = (event: string) => {
        setBetPrice(+event);
    }

    return (
        <Flex flexDirection="column" textAlign="center" alignItems="center" justifyContent="center" >
            <Box mt={10}>
                <Heading textTransform="uppercase">Bet</Heading>

            </Box >
            <Box mt={10} border={"1px"} borderRadius={"xl"} borderColor={"yellow.300"} minW="90%" >
                {topBet ?
                    <CurrentBestBet topBet={topBet} />
                    :
                    <Flex direction={"column"} gap={"2"}>
                        <Badge colorScheme="yellow" variant={"subtle"} textAlign="center" fontSize="2xl" pl={4} pr={4} borderRadius={"md"}>
                            Price to bet
                        </Badge>
                        <Flex direction={"row"} justifyContent="center" alignItems="center" textAlign="center" fontSize={"xl"} color={"yellow.300"}>
                            <Box display={"inline-block"} textAlign="center" mr={2} ml={2} mb={2}>
                                <StarIcon />
                            </Box>
                            {priceToBet} €
                        </Flex>
                    </Flex>
                }
            </Box>
            <Box mt={10} minW="90%" >
                <Input
                    onChange={(value) => searchForSong(value)}
                    defaultValue={selectedSong?.name}
                    placeholder="Search for your song..."
                    _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                    textAlign={"center"}
                />
                <Box justifyContent="center" alignItems="center" mt={8}>
                    {spotifyResults?.map((result: SongSchema) => {
                        return (
                            <Box justifyContent="center" alignContent="center" m="auto" mb={5} cursor="pointer" onClick={() => selectSong(result)} key={result.id} >
                                {
                                    result === selectedSong ?
                                        <Song {...result} isSelected={true} width="60vw" /> :
                                        <Song {...result} isSelected={false} width="60vw" />
                                }
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box mt={10} border={"1px"} borderRadius={"xl"} borderColor={"whatsapp.300"} minW="90%" >
                <Badge colorScheme="whatsapp" variant={"outline"} textAlign="center" fontSize="lg" pl={4} pr={4} mb={2} mt={4} borderRadius={"md"}>
                    <Text fontSize={"lg"}>Your bet price (€)</Text>
                </Badge>
                <NumberInput
                    defaultValue={priceToBet}
                    min={priceToBet}
                    m={2}
                    color={"whatsapp.700"}
                    fontSize={"2xl"}
                    fontWeight={"bold"}
                    onChange={(event) => setPrice(event)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Box>
            <Flex width="100%" justifyContent="center" alignItems="center" mt={"24"} direction={"row"} gap={"8"}>
                <Button colorScheme="pink" onClick={setShowSendBet}>Back</Button>
                <Button colorScheme="blue" onClick={placeBet} isLoading={isLoading}>Place Bet <FaPaypal /></Button>
            </Flex>
        </Flex >
    );
};

export default UserSendBet;