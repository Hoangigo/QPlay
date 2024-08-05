import { Badge, Box, HStack, Heading, Text, useToast } from "@chakra-ui/react";
import EventInformationData from "./EventInformationData";
import SuggestionsList from "./Suggestion/SuggestionsList";
import { useContext, useEffect, useState } from "react";
import ActivitySelection, { ActivityState } from "./Activity/ActivitySelection";
import ActiveVote from "./Activity/Vote/ActiveVote";
import { useParams } from "react-router-dom";
import ActiveAuction from "./Activity/Auction/ActiveAuction";
import { ActivityProvider } from "./Activity/ActivityContext";
import { EventInfoSchema } from "../../../Types/EventSchema";
import { checkIsActivityActive, getEventInfoData } from "../../../APIRoutes";
import { EventProvider } from "./EventContext";
import Cookies from "universal-cookie";
import { DashboardContext } from "./DashboardContext";


const EventDashboard = () => {
    const cookies = new Cookies();
    const [activityState, setActivityState] = useState<ActivityState>(ActivityState.NONE);
    const [event, setEvent] = useState<EventInfoSchema>();
    const { id } = useParams();
    const toast = useToast();
    const [isActive, setIsActive] = useState<boolean>(false);

    const dashboardContext = useContext(DashboardContext);
    if (!dashboardContext) {
        throw new Error("DashboardContext is undefined");
    }
    const [dashboard] = dashboardContext;

    useEffect(() => {
        const fetchEvent = async () => {

            if (id) {
                const currEvent = await getEventInfoData(id);



                if (currEvent) {
                    setEvent(currEvent);
                    const isEventActive = new Date(currEvent.start) <= new Date()
                        && new Date(currEvent.end) >= new Date();
                    setIsActive(isEventActive);
                    if (isEventActive) {

                        const isActivityActive: number = await checkIsActivityActive(id);
                        if (isActivityActive) {
                            if (cookies.get(`${id}_running_activity`) == undefined) {

                                cookies.set(`${id}_running_activity`, isActivityActive as ActivityState);
                                return;
                            }
                            const activityType = cookies.get(`${id}_running_activity`);


                            setActivityState(activityType);
                        } else {

                            cookies.remove(`${id}_running_activity`);
                            setActivityState(ActivityState.NONE);
                        }
                    }
                } else {

                    toast({
                        title: "Error",
                        description: "Event not found",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        }

        fetchEvent();
    }, [id, activityState, dashboard]);

    return (
        <EventProvider value={[event, setEvent]}>
            <Box >
                <HStack m="4" h="100%" alignItems="stretch">
                    <ActivityProvider value={[activityState, setActivityState]}>
                        <Box
                            border="1px"
                            borderColor="purple.200"
                            borderRadius="md"
                            p={4}
                            flex="3"
                            boxSizing="border-box"
                            display="flex"
                            flexDirection="column"
                        >
                            {event ? (
                                <EventInformationData />
                            ) : (
                                <Text>Event not found</Text>
                            )}
                        </Box>
                        <Box
                            border="1px"
                            borderColor="purple.200"
                            borderRadius="md"
                            p={4}
                            flex="7"
                            boxSizing="border-box"
                            display="flex"
                            flexDirection="column"
                        >
                            {isActive ?
                                (activityState != ActivityState.NONE ? (
                                    activityState == ActivityState.VOTING ?
                                        <ActiveVote />
                                        :
                                        <ActiveAuction />
                                ) : (
                                    <ActivitySelection />
                                ))
                                :
                                <>
                                    <Heading as="h1" size="xl" textAlign="center" mb={4}>
                                        Activity selection
                                    </Heading>
                                    <Badge
                                        borderRadius={"xl"}
                                        p={"4"}
                                        mt={"20"}
                                        colorScheme="red"
                                        fontSize={"2xl"}
                                        textAlign={"center"}
                                    >
                                        Event not active
                                    </Badge>
                                </>
                            }

                        </Box>
                        <Box
                            border="1px"
                            borderColor="purple.200"
                            borderRadius="md"
                            p={4}
                            flex="3"
                            boxSizing="border-box"
                            display="flex"
                            alignItems={"center"}
                            flexDirection="column"
                        >
                            <Heading as="h1" size="xl" textAlign="center" mb={4}>
                                Suggestions
                            </Heading>
                            <Box mt="4" overflowY="auto" maxH="105vh">
                                {!isActive ?
                                    <Badge
                                        borderRadius={"xl"}
                                        p={"4"}
                                        mt={"16"}
                                        colorScheme="red"
                                        fontSize={"2xl"}
                                        textAlign={"center"}
                                    >
                                        Event not active
                                    </Badge>
                                    :
                                    (id ? <SuggestionsList eventId={id} isActive={isActive} /> : <Text>Event not found</Text>)
                                }
                            </Box>
                        </Box>
                    </ActivityProvider>
                </HStack>
            </Box>
        </EventProvider >
    );
};

export default EventDashboard;
