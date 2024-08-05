import { useEffect, useRef, useState } from 'react';
import { Box, Heading, SimpleGrid, useToast } from "@chakra-ui/react"
import EventView from './EventView';
import { EventSchema } from '../../../Types/EventSchema';
import { deleteEvent, getHost } from '../../../APIRoutes';
import Cookies from 'universal-cookie';
import DeleteConfirmationDialog from '../HostDashboard/DeleteConfirmationDialog';

const EventList = () => {
    const toast = useToast();
    const [events, setEvents] = useState<EventSchema[]>([]);
    const cookies = new Cookies();
    const [eventId, setEventId] = useState<string>("");
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            const host = await getHost(cookies.get('email'));
            if (host) {
                setEvents(host.events);
            } else {
                console.error("Error: Host not found");
                toast({
                    title: "Error",
                    description: "Host not found",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        fetchEvents();
    }, []);

    const openDeleteConfirmationModal = (id: string) => {
        setEventId(id);
        setIsAlertOpen(true);
    }

    const handleConfirmDelete = async () => {
        setIsAlertOpen(false);
        const success = await deleteEvent(eventId);
        if (success) {
            toast({
                title: "Success",
                description: "Event deleted successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            // Filter the events state to remove the deleted event
            const updatedEvents = events.filter(event => event._id !== eventId);
            setEvents(updatedEvents);
        } else {
            toast({
                title: "Error",
                description: "Could not delete event",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const sortedEvents = [...events].sort((a, b) => {
        const now = new Date();
        const aIsActive = a.start <= now && a.end > now;
        const bIsActive = b.start <= now && b.end > now;

        const aIsUpcoming = a.start > now;
        const bIsUpcoming = b.start > now;

        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;

        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;

        return 0;
    });

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            {sortedEvents.length === 0 ?
                <Box p={5} shadow="md" borderWidth="1px" borderRadius={"xl"} borderColor={"purple.50"} textAlign={"center"} maxW={"fit-content"}>
                    <Heading>No events found</Heading>
                </Box>
                :
                <SimpleGrid columns={3} spacing={10}>
                    {sortedEvents.map((event) => (
                        <EventView key={event._id} event={event} onDelete={() => openDeleteConfirmationModal(event._id)} />
                    ))}
                </SimpleGrid>
            }
            <DeleteConfirmationDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onDelete={handleConfirmDelete}
                cancelRef={cancelRef}
                topic="event"
            />
        </Box>
    )
}

export default EventList;
