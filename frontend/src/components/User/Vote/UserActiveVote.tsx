import { Box, CircularProgress, CircularProgressLabel, Flex, Heading, useToast } from "@chakra-ui/react";
import { VoteOptionSchema, VoteSchema } from "../../../Types/VoteSchema";
import Song from "../../Host/EventDashboard/Song/Song";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { getEventActiveVoteData, voting } from "../../../APIRoutes";
import ActiveHeader from "../../Host/EventDashboard/Activity/ActiveHeader";
import { ActivityState } from "../../Host/EventDashboard/Activity/ActivitySelection";

const UserActiveVote = (vote: VoteSchema) => {
    const toast = useToast();
    const navigate = useNavigate();
    let cookies = new Cookies();
    const { eventId } = useParams();
    const voteStart = new Date(vote.start);
    const voteEnd = new Date(vote.end);
    const totalVotes = vote.voteOptions.reduce((prev: number, current: VoteOptionSchema) => {
        return prev + current.count;
    }
        , 0);
    const duration = ((voteEnd.getTime() - voteStart.getTime()) / 1000);
    const [remainingTime, setRemainingTime] = useState<number>(Math.floor((voteEnd.getTime() - new Date().getTime()) / 1000));


    // fetch vote every 5 seconds
    useEffect(() => {
        const fetch = async () => {
            if (eventId) {
                const fetchedVote = (await getEventActiveVoteData(eventId)).voteActivity;
                if (fetchedVote) {
                    return;
                } else {
                    toast({
                        title: "Vote ended",
                        description: "The voting ended early by the host.",
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


    // update remainingTime bar every  1/2 second
    useEffect(() => {
        const timer = setInterval(() => {
            const currTime = new Date().getTime();

            if (voteEnd.getTime() <= currTime) {
                cookies.remove("votedSongId");
                cookies.remove("alreadyVoted");
                cookies.set(`${eventId}_running_activity`, ActivityState.NONE);
                navigate(`/user/event-overview/${eventId}`);
            }

            setRemainingTime(Math.floor((voteEnd.getTime() - currTime) / 1000));
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, [voteEnd, cookies, navigate, eventId]);

    const voteForSong = async (voteOption: VoteOptionSchema) => {
        if (!cookies.get("alreadyVoted")) {

            const success = await voting(voteOption._id);
            if (success) {
                voteOption.count++;
                cookies.set("alreadyVoted", true);
                cookies.set("votedSongId", voteOption.song.id);
                toast({
                    title: "Thank you!",
                    description: "You successfully voted for: " + voteOption.song.name,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong while voting",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: "Error",
                description: "You can only vote once!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    return (
        voteStart.getTime() <= new Date().getTime() && voteEnd.getTime() >= new Date().getTime() ?
            <Flex flexDirection="column" justifyContent="center" alignItems="center" textAlign="center">
                <Box mt={2}>
                    <Heading textTransform="uppercase" mb={4}>Active Vote</Heading>
                    <ActiveHeader remainingTime={remainingTime} type="vote" totalValue={totalVotes} duration={duration} />
                </Box>
                <Box mt={10} justifyContent="center" alignItems="center" textAlign="center">
                    {vote.voteOptions.map((voteOption: VoteOptionSchema) =>
                        <Flex p={2} flexDirection="column" key={voteOption.song.id}>
                            <Box width="100%" onClick={() => voteForSong(voteOption)} cursor="pointer">
                                {voteOption.song.id === cookies.get("votedSongId") ?
                                    <Song {...voteOption.song} isSelected={true} /> :
                                    <Song {...voteOption.song} isSelected={false} />
                                }
                            </Box>
                            <Box mt={4} justifyContent="center" alignItems="center">
                                <CircularProgress color="purple.300" value={voteOption.count / totalVotes * 100} size={"6rem"}>
                                    <CircularProgressLabel>{voteOption.count}</CircularProgressLabel>
                                </CircularProgress>
                            </Box>
                        </Flex>
                    )}
                </Box>
            </Flex> : <Heading>No active vote</Heading>
    );
};

export default UserActiveVote;