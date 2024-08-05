import { Badge, Button, Flex, useToast, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEventActiveAuctionData, getEventActiveVoteData } from "../../../APIRoutes";
import { VoteSchema } from "../../../Types/VoteSchema";
import { AuctionSchema } from "../../../Types/AuctionSchema";
import UserActiveVote from "../Vote/UserActiveVote";
import UserActiveAuction from "../Auction/UserActiveAuction";
import { ActivityState } from "../../Host/EventDashboard/Activity/ActivitySelection";
import Cookies from "universal-cookie";
import { FaMusic } from "react-icons/fa";

const UserEventOverview = () => {
    const { eventId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();
    const [activeVote, setActiveVote] = useState<VoteSchema>();
    const [activeAuction, setActiveAuction] = useState<AuctionSchema>();
    const cookies = new Cookies();

    useEffect(() => {
        if (!eventId) {
            toast({
                title: "Event not found",
                description: "Please scan QR code again",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const fetchEventData = async () => {
            cookies.set(`${eventId}_running_activity`, ActivityState.NONE);

            //First check if vote is active
            const eventVoteData = await getEventActiveVoteData(eventId);
            if (eventVoteData.voteActivity !== undefined) {
                cookies.set(`${eventId}_running_activity`, ActivityState.VOTING);
                setActiveVote(eventVoteData.voteActivity);


                return;
            }

            //Then check if auction is active
            const auctionData = await getEventActiveAuctionData(eventId);
            if (auctionData.auctionActivity !== undefined) {
                cookies.set(`${eventId}_running_activity`, ActivityState.AUCTION);
                setActiveAuction(auctionData.auctionActivity);


                return;
            }
        }

        fetchEventData();

        const intervalId = setInterval(fetchEventData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const onSuggestSong = () => {
        navigate(`/user/song-suggest/${eventId}`);
    }
    return (
        <Box flexGrow={1} mt={"1"} display="flex" flexDirection="column">
            <Flex direction={"column"} justifyContent="space-between" alignItems={"center"} height="100%">
                <Box m={"1"}>
                    {cookies.get(`${eventId}_running_activity`) == ActivityState.NONE ?
                        (
                            <Badge
                                borderRadius={"lg"}
                                p={"4"}
                                m={"4"}
                                mt={"24"}
                                mb={"24"}
                                colorScheme="purple"
                                fontSize={"lg"}
                                textAlign={"center"}
                            >
                                No activity running
                            </Badge>
                        )
                        :
                        (
                            cookies.get(`${eventId}_running_activity`) == ActivityState.VOTING ?
                                activeVote && <UserActiveVote {...activeVote} />
                                :
                                activeAuction && <UserActiveAuction {...activeAuction} />
                        )
                    }
                </Box>
                <Button colorScheme="purple" mt="24" size={"md"} onClick={onSuggestSong}>
                    <Text mr="2">Suggest</Text>
                    <FaMusic />
                </Button>
            </Flex>
        </Box>
    );



};

export default UserEventOverview;