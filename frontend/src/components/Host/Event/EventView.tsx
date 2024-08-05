import { Box, Text, Badge, VStack, HStack, IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { EventSchema } from '../../../Types/EventSchema';
import { useNavigate } from "react-router-dom";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { AddressSchema } from "../../../Types/AddressSchema";
import { fetchAddress } from "../../../APIRoutes";

type EventViewProps = {
    event: EventSchema;
    onDelete: (id: string) => void;
}

const EventView: React.FC<EventViewProps> = ({ event, onDelete }) => {
    const { title, latitude, longitude, description, start, end, private: isPrivate } = event;
    const [address, setAddress] = useState<AddressSchema>();
    const privacyBadge = isPrivate ? 'Private' : 'Public';
    const privacyColor = isPrivate ? 'red' : 'green';
    const navigate = useNavigate();
    const start_date = new Date(start);
    const end_date = new Date(end);
    const isActive = start_date < new Date() && end_date > new Date();
    const isOver = end_date < new Date();
    const { colorMode } = useColorMode();

    useEffect(() => {
        const fetch = async () => {
            const address: AddressSchema = await fetchAddress({ lat: latitude, lng: longitude });
            if (address) {
                setAddress(address);
            }
        }
        fetch();
    }, []);



    const startString = start_date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin'
    });
    const endString = end_date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Berlin'
    });

    const handleShowDashboard = () => {

        navigate(`/event-dashboard/${event._id}`);
    }

    const handleDeleteEvent = async () => {

        onDelete(event._id);
    }


    return (
        <Box p={5} shadow={colorMode === "dark" ? "dark-lg" : "lg"} border={"2px"} borderColor={colorMode == "dark" ? "purple.700" : "purple.50"} borderRadius={"xl"} color={colorMode === "dark" ? "white" : "black"}>
            <VStack align="stretch" spacing={4} >
                <Box p={5} >
                    <HStack justifyContent="space-between">
                        <HStack>
                            <Text fontSize="xl" fontWeight="bold">{title}</Text>
                            <Badge colorScheme={isOver ? "gray" : privacyColor} borderRadius={"md"}>{isOver ? "Outdated" : privacyBadge}</Badge>
                            {isActive && <Badge colorScheme="messenger" borderRadius={"md"}>Active</Badge>}
                        </HStack>
                        <HStack>
                            {!isOver &&
                                <Tooltip label="Show dashboard" aria-label="Show dashboard" bg={"blue.300"} color={"white"}>
                                    <IconButton colorScheme="messenger" aria-label="Show dashboard" icon={<ViewIcon />} onClick={handleShowDashboard} />
                                </Tooltip>
                            }
                            <Tooltip label="Delete event" aria-label="Delete event" bg={"red"} color={"white"}>
                                <IconButton colorScheme="red" aria-label="Delete event" icon={<DeleteIcon />} onClick={handleDeleteEvent} />
                            </Tooltip>
                        </HStack>
                    </HStack>
                    <Text mt={4}>{description}</Text>
                </Box>

                <Box px={5} py={2} borderRadius={"xl"}>
                    <Text> {startString} -{endString}</Text>
                </Box>

                <Box borderWidth="1px" borderRadius={"xl"} borderColor={"purple.300"} bg={"blackAlpha.500"} overflow={"hidden"}>
                    <Box height="300px" borderRadius={"xl"}>
                        <MapContainer center={{ lat: latitude, lng: longitude }} zoom={15} style={{ height: "100%", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={{ lat: latitude, lng: longitude }}>
                                <Popup>{title}</Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                </Box>
                <Box
                    mt={"2"}

                    borderRadius={"lg"}
                    p={"5"}
                >
                    <Text textAlign={"center"} fontSize={"xl"}>
                        {address !== undefined ?
                            `
                            ${address.street ? address.street : ""} 
                            ${address.number ? address.number : ""} , 
                            ${address.zip ? address.zip : ""} 
                            ${address.city ? address.city : ""}
                            `
                            :
                            "Address loading..."}
                    </Text>
                </Box>

            </VStack >
        </Box >
    )
}

export default EventView;
