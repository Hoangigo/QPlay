import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngLiteral } from 'leaflet';
import { Divider, Box, Input, Text, Switch, FormControl, FormLabel, Flex, IconButton, Tooltip, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, Heading, ModalBody, ModalFooter, Textarea, useColorMode } from "@chakra-ui/react"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AddressSchema } from '../../../Types/AddressSchema';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { EventInfoSchema } from '../../../Types/EventSchema';
import { fetchAddress, updateEventWithInfoSchema } from '../../../APIRoutes';
import { useContext, useEffect, useState } from 'react';
import { DashboardContext } from './DashboardContext';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void;
    eventData: EventInfoSchema;
    setEventData: React.Dispatch<React.SetStateAction<EventInfoSchema>>;
    setMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLngLiteral>>;
    setAddress: React.Dispatch<React.SetStateAction<AddressSchema | undefined>>;
}

const EditEventDataForm = ({ isOpen, setIsOpen, onClose, eventData, setEventData, setMarkerPosition, setAddress }: Props) => {
    const toast = useToast();
    const [editAddress, setEditAddress] = useState<AddressSchema>();
    const [editEventData, setEditEventData] = useState<EventInfoSchema>(eventData);
    const [editMarkerPosition, setEditMarkerPosition] = useState<LatLngLiteral>({ lat: eventData.latitude, lng: eventData.longitude });
    const { colorMode } = useColorMode();

    const dashboardContext = useContext(DashboardContext);
    if (!dashboardContext) {
        throw new Error("DashboardContext is undefined");
    }

    const [, setValue] = dashboardContext;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (editEventData == eventData) {
            setIsOpen(false);
            return;
        }
        //reset the prices if the field is empty
        if (!editEventData.songSuggestionPrice) {
            editEventData.songSuggestionPrice = eventData.songSuggestionPrice;
        }
        if (!editEventData.messagePrice) {
            editEventData.messagePrice = eventData.messagePrice;
        }

        const success = await updateEventWithInfoSchema(editEventData)
        if (success) {
            setEventData((prevData) => ({
                ...prevData,
                ...editEventData,
            }));
            setMarkerPosition(editMarkerPosition);
            setAddress(editAddress);
            toast({
                title: "Event changed",
                description: "Data of your event has changed",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setValue((prev: number) => prev + 1);
            setIsOpen(false);
        } else {
            toast({
                title: "Event change failed",
                description: "Data of your event has not changed",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsOpen(false);
        }
    };

    //change address when the location changes
    useEffect(() => {
        const fetchAddressUE = async () => {
            const address = await fetchAddress({ lat: editEventData.latitude, lng: editEventData.longitude });
            if (address) {
                setEditAddress(address);
            }
        }
        fetchAddressUE();
    }, [editMarkerPosition]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={"4xl"}>
            <ModalOverlay />
            <ModalContent border={"1px"} borderRadius={"2xl"} borderColor={"purple.300"}>
                <ModalHeader textAlign="center" mt={"4"}>
                    <Heading>Edit event data</Heading>
                </ModalHeader>
                <ModalBody>
                    <Box color={colorMode === "light" ? "black" : "white"} m={6}>
                        <Flex gap={4} direction={"column"}>
                            <Flex direction={"row"} justifyContent={"space-between"}>
                                <FormLabel htmlFor="title" fontSize={"lg"} placeSelf={"start"} >Title</FormLabel>
                                <Tooltip label="Edit title" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                    <Input
                                        type="text"
                                        placeholder="Event title"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        value={editEventData.title}
                                        onChange={(e) => setEditEventData({ ...editEventData, title: e.target.value })}
                                        size={"md"}
                                        ml={"5.75rem"}
                                        maxW={"35rem"}
                                    />
                                </Tooltip>
                            </Flex>
                            <Divider />
                            <Flex direction={"row"} justifyContent={"space-between"}>
                                <FormLabel htmlFor="description" fontSize={"lg"} placeSelf={"start"}>Description</FormLabel>
                                <Tooltip label="Edit description" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                    <Textarea
                                        placeholder="Event description"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        value={editEventData.description}
                                        onChange={(e) => setEditEventData({ ...editEventData, description: e.target.value })}
                                        size={"md"}
                                        ml={"2rem"}
                                        maxW={"35rem"}
                                    />
                                </Tooltip>
                            </Flex>
                            <Divider />
                            <Flex direction={"row"} justifyContent={"space-between"}>
                                <FormLabel htmlFor="duration" fontSize={"lg"} placeSelf={"start"}>Duration</FormLabel>
                                <Flex maxW={"35rem"} gap={"9rem"}>
                                    <Tooltip label="Click to edit start date" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                        <Box zIndex={9999} minW={"fit-content"}>
                                            <DatePicker
                                                selected={new Date(editEventData.start)}
                                                onChange={date => date && setEditEventData({ ...editEventData, start: date })}
                                                showTimeSelect
                                                dateFormat="dd.MM.yyyy HH:mm"
                                                customInput={<Input />}
                                            />
                                        </Box>
                                    </Tooltip>
                                    <Tooltip label="Click to edit end date" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                        <Box zIndex={9999} minW={"fit-content"}>
                                            <DatePicker
                                                selected={new Date(editEventData.end)}
                                                onChange={date => date && setEditEventData({ ...editEventData, end: date })}
                                                showTimeSelect
                                                dateFormat="dd.MM.yyyy HH:mm"
                                                customInput={<Input />}
                                            />
                                        </Box>
                                    </Tooltip>
                                </Flex>
                            </Flex>
                            <Divider />
                            <Flex direction={"column"}>
                                <FormLabel htmlFor="location" fontSize={"lg"} placeSelf={"start"}>Location</FormLabel>
                                <Tooltip label="Click to edit location" fontSize='md' placement='right' bg="purple.500" color="white">
                                    <Box borderRadius="md" borderWidth={1} borderColor="purple.300" overflow={"hidden"} w={"100%"} h={"25rem"}>
                                        <MapContainer center={{ lat: eventData.latitude, lng: eventData.longitude }} zoom={13} style={{ height: "100%", width: "100%" }}>
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            <Marker
                                                position={editMarkerPosition}
                                                draggable
                                                eventHandlers={{
                                                    dragend: (event) => {
                                                        const newLatLng = event.target.getLatLng();
                                                        setEditMarkerPosition(newLatLng);
                                                        setEditEventData({ ...editEventData, latitude: newLatLng.lat, longitude: newLatLng.lng });
                                                    }
                                                }}
                                            >
                                                <Popup />
                                            </Marker>
                                        </MapContainer>
                                    </Box>
                                </Tooltip>
                                <Box>
                                    <Text p={"2"} fontSize='lg' textAlign={"center"} mt={"2"}>
                                        {editAddress !== undefined ?
                                            `
                                            ${editAddress.street ? editAddress.street : ""} 
                                            ${editAddress.number ? editAddress.number : ""} , 
                                            ${editAddress.zip ? editAddress.zip : ""} 
                                            ${editAddress.city ? editAddress.city : ""}
                                            `
                                            :
                                            "Address loading..."}
                                    </Text>
                                </Box>
                            </Flex>
                            <Divider />
                            <Flex direction={"row"} justifyContent={"space-between"}>
                                <FormLabel htmlFor="songsuggestionprice" fontSize={"lg"} placeSelf={"start"}>Suggestionprice (€)</FormLabel>
                                <Tooltip label="Click to edit song suggestion price" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                    <Input
                                        type="number"
                                        placeholder="Song Suggestion Price"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        value={editEventData.songSuggestionPrice}
                                        onChange={(e) => setEditEventData({ ...editEventData, songSuggestionPrice: e.target.valueAsNumber })}
                                        maxW={"35rem"}
                                    />
                                </Tooltip>
                            </Flex>
                            <Divider />
                            <Flex direction={"row"} justifyContent={"space-between"}>
                                <FormLabel htmlFor="messageprice" fontSize={"lg"} placeSelf={"start"} mr={"1rem"}>Messageprice (€)</FormLabel>
                                <Tooltip label="Click to edit message price" fontSize='md' placement='right-end' bg="purple.500" color="white">
                                    <Input
                                        type="number"
                                        placeholder="Message Price"
                                        _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                        value={editEventData.messagePrice}
                                        onChange={(e) => setEditEventData({ ...editEventData, messagePrice: e.target.valueAsNumber })}
                                        maxW={"35rem"}
                                    />
                                </Tooltip>
                            </Flex>
                            <Divider />
                            <FormControl display="flex" justifyContent={"space-between"}>
                                <FormLabel htmlFor="private-switch" fontSize={"lg"}>
                                    {editEventData.private ? 'Private' : 'Public'}
                                </FormLabel>
                                <Tooltip label={editEventData.private ? "Set event public" : "Set event private"} fontSize='md' placement="end" bg="purple.500" color="white" mr={"4"}>
                                    <Switch colorScheme="purple" isChecked={editEventData.private} size={"lg"} onChange={() => setEditEventData({ ...editEventData, private: !editEventData.private })} />
                                </Tooltip>
                            </FormControl>
                            <Divider />
                        </Flex>
                    </Box >
                </ModalBody>
                <ModalFooter>
                    <Flex w={"100%"} gap={"4"} alignItems="flex-end" justifyContent="flex-end" mr={6}>
                        <Tooltip label="Cancel" fontSize='md' placement='bottom' bg="red.500" color="white">
                            <IconButton cursor={"pointer"} size={"lg"} icon={<CloseIcon />} aria-label="Delete" colorScheme="red" onClick={() => { setIsOpen(false) }}>
                                Cancle
                            </IconButton>
                        </Tooltip>

                        <Tooltip label="Submit" fontSize='md' placement='bottom' bg="green.500" color="white">
                            <IconButton onClick={handleSubmit} cursor={"pointer"} size={"lg"} icon={<CheckIcon />} aria-label="Delete" colorScheme="green">
                                Confirm
                            </IconButton>
                        </Tooltip>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
};

export default EditEventDataForm;
