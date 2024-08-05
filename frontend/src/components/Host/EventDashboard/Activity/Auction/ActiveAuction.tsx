import { Flex, Heading, Tooltip, IconButton, Box, useToast, Badge } from "@chakra-ui/react";
import CurrentBestBet from "./CurrentBestBet";
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import ActiveHeader from "../ActiveHeader";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityContext } from "../ActivityContext";
import { EventActiveAuctionSchema } from "../../../../../Types/EventSchema";
import { deleteAuction, getEventActiveAuctionData, getTopBet } from "../../../../../APIRoutes";
import { AuctionSchema, BetSchema } from "../../../../../Types/AuctionSchema";
import { EventContext } from "../../EventContext";
import { ActivityState } from "../ActivitySelection";
import Cookies from "universal-cookie";

const ActiveAuction = () => {
    const [remainingTime, setRemainingTime] = useState<number>();
    const [numOfBets, setNumOfBets] = useState<number>(0);
    const [topBet, setTopBet] = useState<BetSchema>();
    const [auctionId, setAuctionId] = useState<string>("");
    const [endTime, setEndTime] = useState<Date | null>(null);
    const toast = useToast();
    const [isAuctionOver, setIsAuctionOver] = useState<boolean>();
    const cookies = new Cookies();
    const isAuctionOverRef = useRef(isAuctionOver);
    const [auctionOverShown, setAuctionOverShown] = useState<boolean>(false);
    const auctionOverShownRef = useRef(auctionOverShown);
    const [duration, setDuration] = useState<number>(0);

    const activityContext = useContext(ActivityContext);
    if (!activityContext) {
        throw new Error("ActivityContext is undefined");
    }
    const [, setActivityState] = activityContext;

    const eventContext = useContext(EventContext);
    if (!eventContext) {
        throw new Error("EventContext is undefined");
    }
    const [event] = eventContext;

    useEffect(() => {
        const fetch = async () => {


            const response = await getEventActiveAuctionData(event._id);

            const newEvent: EventActiveAuctionSchema = response;
            const currAuction: AuctionSchema = newEvent.auctionActivity;
            if (newEvent && currAuction) {

                if (cookies.get(`${event._id}_running_activity_id`) == undefined) {
                    cookies.set(`${event._id}_running_activity_id`, currAuction._id);
                }
                setAuctionId(currAuction._id);
                setNumOfBets(currAuction.bets.length);
                if (currAuction.bets.length !== 0) {
                    setTopBet(currAuction.bets.sort((a, b) => b.price - a.price)[0]);
                }
                setEndTime(new Date(currAuction.end));
                setDuration(Math.floor(new Date(currAuction.end).getTime() - new Date(currAuction.start).getTime()) / 1000);
                setIsAuctionOver(false);
            } else {

                if (isAuctionOverRef.current && !auctionOverShownRef.current) {
                    setAuctionOverShown(true);
                    auctionOverShownRef.current = true;
                    toast({
                        title: "Auction is over",
                        description: "Auction time is over, top bet is shown",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    if (!auctionOverShownRef.current) {
                        toast({
                            title: "No auction is active",
                            description: "No auction is active",
                            status: "info",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }
                if (cookies.get(`${event._id}_running_activity_id`)) {
                    const response = await getTopBet(cookies.get(`${event._id}_running_activity_id`));
                    if (response) {
                        const topBet: BetSchema = response;
                        setTopBet(topBet);
                    }
                }
            }
        }

        fetch();

        const intervalId = setInterval(fetch, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const updateRemainingTime = () => {
            if (endTime && endTime.getTime() > new Date().getTime()) {
                const newRemainingTime = Math.floor((endTime.getTime() - new Date().getTime()) / 1000);
                setRemainingTime(newRemainingTime);
                cookies.set(`${event._id}_running_activity_remaining_time`, newRemainingTime);
            } else {
                setIsAuctionOver(true);
            }
        }

        updateRemainingTime();

        const intervalId = setInterval(updateRemainingTime, 250);

        return () => clearInterval(intervalId);
    }, [endTime]);

    useEffect(() => {
        isAuctionOverRef.current = isAuctionOver;
    }, [isAuctionOver]);

    const handleStopAuction = async () => {
        const success = await deleteAuction(auctionId);
        if (success) {
            toast({
                title: "Success",
                description: "Auction stopped and deleted",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            cookies.remove(`${event._id}_running_activity_id`);
            cookies.set(`${event._id}_running_activity`, ActivityState.NONE);
            setActivityState(ActivityState.NONE);
        } else {
            toast({
                title: "Error",
                description: "Could not stop auction",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const confirmAuction = () => {

        toast({
            title: "Confirmation",
            description: "Auction was confirmed",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        cookies.remove(`${event._id}_running_activity_id`);
        cookies.set(`${event._id}_running_activity`, ActivityState.NONE);
        setActivityState(ActivityState.NONE);
    }


    return (
        <Box>
            <Flex direction={"column"} mb={"0.5rem"} bgSize={"contain"}>
                <Flex justifyContent={"space-between"}>
                    <Heading size="lg" mb={12}>
                        Auction {remainingTime && remainingTime > 0 ? "running" : "results"}
                    </Heading>
                    {isAuctionOver ?
                        <Tooltip label={"Confirm auction"} fontSize='md' placement='left-start' bg="green.500" color="white">
                            <IconButton
                                aria-label="Confirm"
                                icon={<CheckIcon />}
                                variant="outline"
                                cursor={"pointer"}
                                colorScheme="green"
                                size="lg"
                                ml={"auto"}
                                onClick={confirmAuction}
                            />
                        </Tooltip>
                        :
                        <Tooltip label={"Stop and delete auction"} fontSize='md' placement='left-start' bg="red.500" color="white">
                            <IconButton
                                aria-label="Stop"
                                icon={<DeleteIcon />}
                                variant="outline"
                                cursor={"pointer"}
                                colorScheme="red"
                                size="lg"
                                ml={"auto"}
                                onClick={handleStopAuction}
                            />
                        </Tooltip>
                    }
                </Flex>
                <Flex flexDirection={"column"}>
                    <ActiveHeader remainingTime={remainingTime ? remainingTime : 0} type={"auction"} totalValue={numOfBets} duration={duration} />
                    <Flex gap={6} direction={"column"} align={"center"} mt={"32"}>
                        {topBet ?
                            <CurrentBestBet topBet={topBet} />
                            :
                            <Badge
                                borderRadius={"xl"}
                                p={"4"}
                                mt={"20"}
                                colorScheme="purple"
                                fontSize={"2xl"}
                                textAlign={"center"}
                            >
                                No bet yet
                            </Badge>}
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default ActiveAuction;
