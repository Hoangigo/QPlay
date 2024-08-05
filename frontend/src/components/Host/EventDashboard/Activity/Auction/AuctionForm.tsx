import { FormControl, FormLabel, FormErrorMessage, Button, Box, Flex, NumberInputField, NumberInput, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";
import { ActivityContext } from "../ActivityContext";
import { EventContext } from "../../EventContext";
import { createAuction } from "../../../../../APIRoutes";
import { CreateAuctionSchema } from "../../../../../Types/AuctionSchema";
import Cookies from "universal-cookie";
import { ActivityState } from "../ActivitySelection";


const AuctionForm = () => {
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

    const cookies = new Cookies();
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            startPrice: 0,
            duration: 0,
        },
        validationSchema: Yup.object({
            startPrice: Yup.number().required("Required"),
            duration: Yup.number().required("Required").positive("Duration must be a positive number"),
        }),
        onSubmit: async (values) => {
            const { startPrice, duration } = values;
            const start = new Date();
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + duration);

            const auctionData: CreateAuctionSchema = {
                startPrice: startPrice,
                start: start,
                end: end,
            };

            const success = await createAuction(event._id, auctionData);
            if (success) {
                toast({
                    title: "Auction created.",
                    description: "Your auction has been created.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                cookies.set(`${event._id}_running_activity_remaining_time`, duration * 60);

                cookies.set(`${event._id}_running_activity`, ActivityState.AUCTION);

                setActivityState(ActivityState.AUCTION);
            } else {
                toast({
                    title: "Error",
                    description: "An error occurred while creating your auction.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
    });

    return (
        <Box as="form" onSubmit={formik.handleSubmit} mt={"24"}>
            <Flex direction={"column"}>
                <Flex direction="column" gap={"1rem"}>
                    <FormControl id="startPrice" isInvalid={formik.touched.startPrice && Boolean(formik.errors.startPrice)} mt={"4"} >
                        <Flex>
                            <FormLabel minW={"xs"} fontSize={"lg"}> Start price (€)</FormLabel>
                            <NumberInput
                                value={formik.values.startPrice}
                                onChange={(valueString) => { formik.setFieldValue("startPrice", Number(valueString)) }}
                                min={0}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Flex>

                        <FormErrorMessage>{formik.errors.startPrice}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="duration" isInvalid={formik.touched.duration && Boolean(formik.errors.duration)} mt={"4"} mb={"4"}>
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
                <Button type="submit" colorScheme="purple" mt={4}>
                    Start auction
                </Button>
            </Flex >
        </Box >
    );
};

export default AuctionForm;
