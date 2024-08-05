import { FormControl, FormLabel, FormErrorMessage, Button, Box, Flex, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SongSearchModal from "../../Song/SongSearchModal";
import Song from "../../Song/Song";
import { SongSchema } from "../../../../../Types/SongSchema";
import { useContext, useState } from "react";
import { ActivityContext } from "../ActivityContext";
import { createVote } from "../../../../../APIRoutes";
import { CreateVoteSchema } from "../../../../../Types/VoteSchema";
import { EventContext } from "../../EventContext";
import { ActivityState } from "../ActivitySelection";
import Cookies from "universal-cookie";

const MIN_SONGS = 2;
const MAX_SONGS = 4;

const VoteForm = () => {
    const [isSongSearchModalOpen, setIsSongSearchModalOpen] = useState<boolean>(false);
    const [selectedSongIndexForModal, setSelectedSongIndexForModal] = useState<number | null>(null);
    const cookies = new Cookies();

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

    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            duration: 0,
            voteOptions: [] as SongSchema[],
        },
        validationSchema: Yup.object({
            duration: Yup.number().required("Required").positive("Duration must be a positive number"),
            voteOptions: Yup.array().required("Required").min(MIN_SONGS, `Must have at least ${MIN_SONGS} songs`)
        }),
        onSubmit: async (values) => {
            const { duration, voteOptions: voteOptions } = values;
            const start = new Date();
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + duration);

            const options = voteOptions.map((song) => {
                return {
                    songId: song.id,
                    count: 0,
                }
            });

            const voteData: CreateVoteSchema = {
                start: start,
                end: end,
                voteOptions: options,
            };



            const success = await createVote(event._id, voteData);

            if (success) {
                toast({
                    title: "Vote created",
                    description: "Vote created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                cookies.set(`${event._id}_running_activity_remaining_time`, duration * 60);

                cookies.set(`${event._id}_running_activity`, ActivityState.VOTING);

                setActivityState(ActivityState.VOTING);
            } else {
                toast({
                    title: "Error",
                    description: "Vote could not be created",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
    });

    const selectSong = (song: SongSchema, index: number | null) => {
        if (index !== null) {
            const newSongs = [...formik.values.voteOptions];
            newSongs[index] = song;
            formik.setFieldValue("voteOptions", newSongs);
        }
    };

    const openSongSearch = (index: number) => {
        setSelectedSongIndexForModal(index);
        setIsSongSearchModalOpen(true);
    };

    return (
        <Box as="form" onSubmit={formik.handleSubmit}>
            <Flex direction={"column"}>
                <Flex direction="row">
                    <FormControl id="duration" isInvalid={formik.touched.duration && Boolean(formik.errors.duration)} mt={"10"}>
                        <Flex>
                            <FormLabel minW={"xs"} fontSize={"lg"}>Duration (min)</FormLabel>
                            <NumberInput
                                value={formik.values.duration}
                                onChange={(valueString) => { formik.setFieldValue("duration", Number(valueString)) }}
                                min={2}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>
                        <FormErrorMessage>{formik.errors.duration}</FormErrorMessage>
                    </FormControl>
                </Flex>
                <FormControl id="voteoptions" mt={"12"}>
                    <Flex direction="column" mt="6" gap={"4"}>
                        {Array(MAX_SONGS).fill(null).map((_, i) =>
                            formik.values.voteOptions[i]
                                ? <Box key={i} cursor={"pointer"} onClick={() => openSongSearch(i)}><Song {...formik.values.voteOptions[i]} key={i} isSelected={false} /></Box>
                                : <Button minH={"6.66rem"} onClick={() => openSongSearch(i)} key={i} >Select Songoption</Button>
                        )}

                    </Flex>
                    <SongSearchModal
                        isOpen={isSongSearchModalOpen}
                        onClose={() => setIsSongSearchModalOpen(false)}
                        onSelect={(song) => selectSong(song, selectedSongIndexForModal)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="purple" mt={"12"}>
                    Start voting
                </Button>
            </Flex >
        </Box >
    );
};

export default VoteForm;
