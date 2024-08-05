import { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngLiteral } from 'leaflet';
import { VStack, Box, Text, Flex, IconButton, Tooltip, useToast, Badge, Heading, Spacer, Divider } from "@chakra-ui/react"
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { AddressSchema } from '../../../Types/AddressSchema';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { EventInfoSchema } from '../../../Types/EventSchema';
import { FaQrcode } from 'react-icons/fa';
import QRModal from '../../Helper/QRModal';
import { deleteEvent, fetchAddress } from '../../../APIRoutes';
import { EventContext } from './EventContext';
import EditEventDataForm from './EditEventDataForm';
import DeleteConfirmationDialog from '../HostDashboard/DeleteConfirmationDialog';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;



const EventInformationData = () => {
    const eventContext = useContext(EventContext);
    if (!eventContext) {
        throw new Error("EventContext is undefined");
    }
    const [event] = eventContext;
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<EventInfoSchema>(event);
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>({ lat: eventData.latitude, lng: eventData.longitude });
    const [address, setAddress] = useState<AddressSchema>();
    const [showModal, setShowModal] = useState(false);
    const [activeEdit, setActiveEdit] = useState(false);
    const [url] = useState(`localhost:6969/user/song-suggest/${eventData._id}}`);
    const toast = useToast();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setEventData(event);
        setMarkerPosition({ lat: event.latitude, lng: event.longitude });
    }, [navigate]);

    useEffect(() => {
        const fetchAddressUE = async () => {
            const address = await fetchAddress({ lat: eventData.latitude, lng: eventData.longitude });
            if (address) {
                setAddress(address);
            }
        }
        fetchAddressUE();
    }, [location]);

    useEffect(() => {
        setMarkerPosition({ lat: eventData.latitude, lng: eventData.longitude });
    }, [location]);

    const openDeleteConfirmationModal = () => {
        setIsAlertOpen(true);
    }

    const handleConfirmDelete = async () => {
        setIsAlertOpen(false);
        const success = await deleteEvent(event._id);
        if (success) {
            toast({
                title: "Success",
                description: "Event deleted",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate("/host-dashboard/1");
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

    const handleEditButton = () => {
        setActiveEdit(true);
    }

    const endEdit = () => {
        setActiveEdit(false);
    }

    const handleQRCodeClick = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <VStack>
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
                {eventData.title}
            </Heading>
            <Text pt='2' fontSize='lg' textAlign="center">
                {eventData.description}
            </Text>
            <Divider />
            <Box w="100%" display={"flex"} flexDirection={"row"} justifyContent={"center"} m={"2"}>
                <Badge fontSize='lg' colorScheme="purple" borderRadius={"md"}>
                    Duration
                </Badge>
            </Box>
            <Box w="100%" display={"flex"} flexDirection={"row"} justifyContent={"center"} m={"2"}>
                <Text fontSize='lg' fontWeight={"bold"}>
                    {new Date(eventData.start).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Europe/Berlin'
                    })}
                </Text>
            </Box>
            <Box w="100%" display={"flex"} flexDirection={"row"} justifyContent={"center"} m={"2"}>
                <Text fontSize='lg' fontWeight={"bold"}>
                    {new Date(eventData.end).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Europe/Berlin'
                    })}
                </Text>
            </Box>
            <Divider />
            <Box w="100%" h="18rem" borderRadius="md" borderWidth={1} borderColor="purple.300" overflow={"hidden"} mt={"2"}>
                <MapContainer center={{ lat: eventData.latitude, lng: eventData.longitude }} zoom={10} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                        position={markerPosition}
                    >
                        <Popup />
                    </Marker>
                </MapContainer>
            </Box>
            <Box w="100%" mb={"2"}>
                <Text p={"2"} fontSize='lg' textAlign={"center"}>
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
            <Divider />
            <Box w="100%" mb='2' p={1} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Text fontSize='lg' fontWeight={"bold"}>
                    Suggestionprice:
                </Text>
                <Badge fontSize='lg' colorScheme="purple" borderRadius={"md"}>
                    {eventData.songSuggestionPrice}€
                </Badge>
            </Box>
            <Divider />
            <Box w="100%" mb='2' p={1} display={"flex"} flexDirection={"row"} justifyContent={"space-between"}>
                <Text fontSize='lg' fontWeight={"bold"}>
                    Messageprice:
                </Text>
                <Badge fontSize='lg' colorScheme="purple" borderRadius={"md"}>
                    {eventData.messagePrice}€
                </Badge>
            </Box>
            <Divider />
            <Badge mb={"6"} mt={"2"} fontSize="xl" colorScheme="purple" variant={eventData.private ? "outline" : "solid"} borderRadius={"md"}>
                {eventData.private ? 'Private event' : 'Public event'}
            </Badge>
            <Flex w={"100%"} gap={"1"} alignItems="center" justifyContent="center">
                <Tooltip label="Edit event" fontSize='md' bg="purple.500" color="white" >
                    <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit the event"
                        onClick={handleEditButton}
                        colorScheme="purple"
                        size={"lg"}
                        cursor={"pointer"}
                    />
                </Tooltip>
                <Spacer />
                <Tooltip label="Show qrcode" fontSize='md' bg="purple.500" color="white" >
                    <IconButton
                        icon={<FaQrcode />}
                        aria-label="Generate QR Code"
                        onClick={handleQRCodeClick}
                        colorScheme="purple"
                        size={"lg"}
                        cursor={"pointer"}
                    />
                </Tooltip>
                <Spacer />
                <Tooltip label="Delete event" fontSize='md' bg="red.500" color="white">
                    <IconButton cursor={"pointer"} size={"lg"} icon={<DeleteIcon />} aria-label="Delete" colorScheme="red" onClick={openDeleteConfirmationModal}>
                        Delete
                    </IconButton>
                </Tooltip>
            </Flex>

            <EditEventDataForm
                isOpen={activeEdit}
                setIsOpen={setActiveEdit}
                onClose={endEdit}
                eventData={eventData}
                setEventData={setEventData}
                setMarkerPosition={setMarkerPosition}
                setAddress={setAddress}
            />
            <QRModal isOpen={showModal} onClose={closeModal} url={url} />
            <DeleteConfirmationDialog
                isOpen={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                onDelete={handleConfirmDelete}
                cancelRef={cancelRef}
                topic="event"
            />
        </VStack >

    )
}

export default EventInformationData;

