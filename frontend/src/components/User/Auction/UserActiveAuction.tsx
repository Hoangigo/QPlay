import { Badge, Box, Button, Flex, Heading, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import UserSendBet from "./UserSendBet";
import { useNavigate, useParams } from "react-router-dom";
import CurrentBestBet from "../../Host/EventDashboard/Activity/Auction/CurrentBestBet";
import { AuctionSchema, BetSchema } from "../../../Types/AuctionSchema";
import Cookies from "universal-cookie";
import { getEventActiveAuctionData, getTopBet } from "../../../APIRoutes";
import ActiveHeader from "../../Host/EventDashboard/Activity/ActiveHeader";
import { ActivityState } from "../../Host/EventDashboard/Activity/ActivitySelection";


const UserActiveAuction = (auction: AuctionSchema) => {
    const [showSendBet, setShowSendBet] = useState(false);
    const startPrice = auction.startPrice;
    const [highestPrice, setHighestPrice] = useState(startPrice);
    const [remainingTime, setRemainingTime] = useState(Math.floor((new Date(auction.end).getTime() - new Date().getTime()) / 1000));
    const [topBet, setTopBet] = useState<BetSchema>();
    const auctionStart = new Date(auction.start);
    const auctionEnd = new Date(auction.end);
    const duration = (Math.floor((auctionEnd.getTime() - auctionStart.getTime()) / 1000));
    const totalBets = auction.bets.length;
    const { eventId } = useParams();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const toast = useToast();



    // fetch topBet every 5 seconds
    useEffect(() => {
        const fetch = async () => {
            if (eventId) {
                const fetchedAuction = (await getEventActiveAuctionData(eventId)).auctionActivity;
                if (fetchedAuction) {
                    const fetchedTopBet = await getTopBet(fetchedAuction._id);

                    if (fetchedTopBet) {
                        setTopBet(fetchedTopBet);
                        setHighestPrice(fetchedTopBet.price);
                    } else {
                        setHighestPrice(auction.startPrice);
                    }

                } else {
                    toast({
                        title: "Auction ended",
                        description: "The auction ended early by the host.",
                        status: "info",
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate(`/user/event-overview/${eventId}`);
                }
            } else {
                navigate(`/login`);
            }
        };
        fetch();

        const intervalId = setInterval(fetch, 5000);

        return () => clearInterval(intervalId);
    }, []);

    // update remainingTime every 0.5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            const currTime = new Date().getTime();

            if (auctionEnd.getTime() <= currTime) {
                cookies.set(`${eventId}_running_activity`, ActivityState.NONE);
                navigate(`/user/event-overview/${eventId}`);
            }

            setRemainingTime(Math.floor((auctionEnd.getTime() - currTime) / 1000));
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, [auctionEnd, cookies, navigate, eventId]);

    return (
        !showSendBet && auction ?
            <Flex flexDirection="column" justifyContent="center" alignItems="center" textAlign="center">
                <Box mt={4}>
                    <Heading textTransform="uppercase" mb={4}>Active auction</Heading>
                    <ActiveHeader
                        remainingTime={remainingTime}
                        type={"auction"}
                        totalValue={totalBets}
                        duration={duration}
                    />
                </Box>
                <Box textAlign="center" mt={"12"}>
                    {topBet ?
                        <CurrentBestBet topBet={topBet} />
                        :
                        (<Badge
                            borderRadius={"xl"}
                            p={"4"}
                            mt={"20"}
                            colorScheme="purple"
                            fontSize={"2xl"}
                            textAlign={"center"}
                        >
                            No bet yet
                        </Badge>)
                    }
                </Box>
                <Button colorScheme="yellow" m={10} size={"lg"} onClick={() => setShowSendBet(true)}>Place bet</Button>
            </Flex>
            : <UserSendBet
                setShowSendBet={() => setShowSendBet(false)}
                priceToBet={totalBets ? highestPrice + 1 : highestPrice}
                auctionId={auction._id}
            />
    );
}

export default UserActiveAuction;