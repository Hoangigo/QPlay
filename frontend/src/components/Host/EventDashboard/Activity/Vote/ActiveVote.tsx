import { useState, useEffect, useContext, useRef } from 'react';
import { Box, VStack, Flex, Heading, IconButton, Tooltip, useToast } from "@chakra-ui/react";
import VoteOption from './VoteOption';
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import ActiveHeader from '../ActiveHeader';
import { ActivityContext } from '../ActivityContext';
import { EventActiveVoteSchema } from '../../../../../Types/EventSchema';
import { deleteVote, getEventActiveVoteData, getVote } from '../../../../../APIRoutes';
import { VoteOptionSchema, VoteSchema } from '../../../../../Types/VoteSchema';
import { EventContext } from '../../EventContext';
import { ActivityState } from '../ActivitySelection';
import Cookies from 'universal-cookie';

const calculateTotalVotes = (voteOptions: VoteOptionSchema[]) => {
    return voteOptions.reduce((prev, current) => prev + current.count, 0);
}

const ActiveVote = () => {
    const toast = useToast();
    const [voteId, setVoteId] = useState<string>("");
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const [voteStats, setVoteStats] = useState<VoteOptionSchema[]>([]);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isVoteOver, setIsVoteOver] = useState<boolean>();
    const cookies = new Cookies();
    const isVoteOverRef = useRef(isVoteOver);
    const [voteOverShown, setVoteOverShown] = useState<boolean>(false);
    const voteOverShownRef = useRef(voteOverShown);
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

    const [endTime, setEndTime] = useState<Date | null>(null);

    useEffect(() => {
        const fetch = async () => {


            const response = await getEventActiveVoteData(event._id);

            const newEvent: EventActiveVoteSchema = response;
            const currVote: VoteSchema = newEvent.voteActivity;
            if (newEvent && currVote) {
                if (cookies.get(`${event._id}_running_activity_id`) == undefined) {
                    cookies.set(`${event._id}_running_activity_id`, currVote._id);
                }
                setVoteId(currVote._id);

                const newVoteStats: VoteOptionSchema[] = currVote.voteOptions.
                    map(voteOption => ({ _id: voteOption._id, song: voteOption.song, count: voteOption.count })).
                    sort((a, b) => b.count - a.count);

                const newTotalVotes = calculateTotalVotes(newVoteStats);
                setTotalVotes(newTotalVotes);
                setVoteStats(newVoteStats);

                setEndTime(new Date(currVote.end));
                setDuration(Math.floor(new Date(currVote.end).getTime() - new Date(currVote.start).getTime()) / 1000);
                setIsVoteOver(false);
            } else {
                if (isVoteOverRef.current && !voteOverShownRef.current) {
                    setVoteOverShown(true);
                    voteOverShownRef.current = true;
                    toast({
                        title: "Vote is over",
                        description: "Voting time is over, results are shown",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    if (!voteOverShownRef.current) {
                        toast({
                            title: "No vote is active",
                            description: "No vote is active",
                            status: "info",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }
                if (cookies.get(`${event._id}_running_activity_id`)) {
                    const response = await getVote(cookies.get(`${event._id}_running_activity_id`));
                    const voteResult: VoteSchema = response;

                    const voteResultStats: VoteOptionSchema[] = voteResult.voteOptions.
                        map(voteOption => ({ _id: voteOption._id, song: voteOption.song, count: voteOption.count })).
                        sort((a, b) => b.count - a.count);
                    const newTotalVotes = calculateTotalVotes(voteResultStats);
                    setTotalVotes(newTotalVotes);
                    setVoteStats(voteResultStats);
                }
            }
        }

        fetch();

        const intervalId = setInterval(fetch, 5000);

        return () => clearInterval(intervalId);
    }, [totalVotes]);

    useEffect(() => {
        const updateRemainingTime = () => {
            if (endTime && endTime.getTime() > new Date().getTime()) {
                const newRemainingTime = Math.floor((endTime.getTime() - new Date().getTime()) / 1000);
                setRemainingTime(newRemainingTime);
                cookies.set(`${event._id}_running_activity_remaining_time`, newRemainingTime);
            } else {
                setIsVoteOver(true);
            }
        }

        updateRemainingTime();

        const intervalId = setInterval(updateRemainingTime, 250);

        return () => clearInterval(intervalId);
    }, [endTime]);

    useEffect(() => {
        isVoteOverRef.current = isVoteOver;
    }, [isVoteOver]);


    const handleStopVote = async () => {
        if (!voteId) {
            throw new Error("Vote data is undefined");
        }
        const success = await deleteVote(voteId);
        if (success) {
            toast({
                title: "Vote stopped",
                description: "Vote stopped and deleted",
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
                description: "Vote could not be stopped",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const confirmVote = () => {

        toast({
            title: "Confirmation",
            description: "Vote was confirmed",
            status: "info",
            duration: 5000,
            isClosable: true,
        });
        cookies.remove(`${event._id}_running_activity_id`);
        cookies.set(`${event._id}_running_activity`, ActivityState.NONE);
        setActivityState(ActivityState.NONE);
    }

    return (
        <Box>
            <Flex direction={"column"} mb={"0.5rem"} bgSize={"contain"} align={"stretch"}>
                <Flex justifyContent={"space-between"}>
                    <Heading size="lg" mb={4} textAlign={"center"}>
                        Voting {remainingTime && remainingTime > 0 ? "running" : "results"}
                    </Heading>
                    {isVoteOver ?
                        <Tooltip label={"Confirm vote"} fontSize='md' placement='left-start' bg="green.500" color="white">
                            <IconButton
                                aria-label="Confirm"
                                icon={<CheckIcon />}
                                variant="outline"
                                cursor={"pointer"}
                                colorScheme="green"
                                size="lg"
                                ml={"auto"}
                                onClick={confirmVote}
                            />
                        </Tooltip>
                        :
                        <Tooltip label={"Stop and delete voting"} fontSize='md' placement='left-start' bg="red.500" color="white">
                            <IconButton
                                aria-label="Stop"
                                icon={<DeleteIcon />}
                                variant="outline"
                                cursor={"pointer"}
                                colorScheme="red"
                                size="lg"
                                ml={"auto"}
                                onClick={handleStopVote}
                            />
                        </Tooltip>
                    }
                </Flex>
                <VStack spacing={4} mt={"8"}>
                    <ActiveHeader remainingTime={remainingTime ? remainingTime : 0} type={"vote"} totalValue={totalVotes ? totalVotes : 0} duration={duration} />
                    {voteStats?.length && voteStats.map((voteStat, index) => (
                        <VoteOption key={voteStat._id} voteStat={voteStat} totalVotes={totalVotes} progressColor={index === 0 ? "yellow.500" : ""} />
                    ))}
                </VStack>
            </Flex>
        </Box>
    );
};

export default ActiveVote;
