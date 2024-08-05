import { Badge, Box, Button, Flex, Input, Text, useColorMode, useToast } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { fetchSongs, getEventInfoData } from "../../../APIRoutes";
import { SongSchema } from "../../../Types/SongSchema";
import Song from "../../Host/EventDashboard/Song/Song";
import { ShoppingCart } from "react-feather";
import UserSongSuggestionConfiguration from "./UserSongSuggestionConfiguration";
import { useNavigate, useParams } from "react-router-dom";
import { EventInfoSchema } from "../../../Types/EventSchema";

const UserSongSuggest = () => {
    const [spotifyResults, setSpotifyResults] = useState<SongSchema[]>();
    const [currentPrice, setCurrentPrice] = useState(0);
    const [songPrice, setSongPrice] = useState(0);
    const [messagePrice, setMessagePrice] = useState(0);
    const [selectedSong, setSelectedSong] = useState<SongSchema>();
    const [showConfiguration, setShowConfiguration] = useState(false);
    const { eventId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

    useEffect(() => {
        const fetch = async () => {
            if (eventId) {
                await getEventInfoData(eventId).then((event: EventInfoSchema) => {
                    if (event) {
                        setSongPrice(event.songSuggestionPrice);
                        setMessagePrice(event.messagePrice);
                    }
                });
            }
        }
        fetch();
    }, [eventId]);

    const searchForSong = async (userInput: ChangeEvent<HTMLInputElement>) => {
        const currentTargetValue: string = userInput.currentTarget.value;
        const songLimit = 5;
        const spotifyResults = await fetchSongs(currentTargetValue, songLimit);
        setSpotifyResults(spotifyResults);
        setCurrentPrice(0);
        setSelectedSong({} as SongSchema);
    }

    const selectSong = (song: SongSchema) => {
        setCurrentPrice(songPrice);
        setSelectedSong(song);
    }

    const showSuggestConfiguration = () => {
        if (selectedSong?.id) {
            setShowConfiguration(true);
        } else {
            toast({
                title: "Select a song",
                description: "Please select a song before you continue",
                status: "info",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const backToOverview = () => {
        navigate(`/user/event-overview/${eventId}`);
    }

    return (
        !showConfiguration ?
            <Flex flexDirection="column" minH={"70vh"}>
                <Flex placeSelf={"flex-start"} justifyContent={"stretch"} ml={"auto"} mb={10} mr={"auto"} gap={"8"}>
                    <Box textAlign="center" minW={"50%"}>
                        <Input
                            type="text"
                            placeholder="Search for your song..."
                            _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                            onChange={(value) => searchForSong(value)}
                            defaultValue={selectedSong?.name}
                        />
                    </Box>
                    <Badge colorScheme="green" textAlign="center" fontSize="2xl" alignSelf={"flex-start"} borderRadius={"md"}>
                        <Box display="inline-block" mr={4} verticalAlign={"middle"} mb={"1"}>
                            <ShoppingCart />
                        </Box>
                        {currentPrice} €
                    </Badge>
                </Flex>
                <Flex minW={"100%"} >
                    <Box width="100%" justifyContent="center" alignItems="center" mt={5}>
                        {spotifyResults?.map((result: SongSchema) => {
                            return (
                                <Box width="50%" justifyContent="center" alignContent="center" m="auto" mb={5} cursor="pointer" onClick={() => selectSong(result)} key={result.id} >
                                    {
                                        result === selectedSong ?
                                            <Song {...result} isSelected={true} /> :
                                            <Song {...result} isSelected={false} />
                                    }
                                </Box>
                            )
                        })}
                    </Box>
                </Flex>
                <Flex width="100%" justifyContent="center" alignItems="center" mt={5} direction={"row"} gap={"8"}>
                    <Button justifySelf="center" alignSelf="center" size={"md"} colorScheme="pink" onClick={backToOverview} >Back</Button>
                    {selectedSong && <Button justifySelf="center" alignSelf="center" size={"md"} colorScheme="purple" onClick={showSuggestConfiguration} >Continue</Button>}
                </Flex>
            </Flex >
            : selectedSong ? <UserSongSuggestionConfiguration song={selectedSong} price={currentPrice} showConfiguration={() => setShowConfiguration(false)} messagePrice={messagePrice} /> : <Text>No selected song!!</Text>
    );
};

export default UserSongSuggest;