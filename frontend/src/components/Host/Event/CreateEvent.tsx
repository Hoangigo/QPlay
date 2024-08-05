import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Switch,
    Text,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberIncrementStepper,
    NumberInputStepper,
    FormErrorMessage,
    NumberDecrementStepper,
    HStack,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import {
    Formik,
    Field,
    Form,
    ErrorMessage,
    FieldProps,
    FormikProps,
} from "formik";
import { LatLngLiteral } from "leaflet";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import { AddressSchema } from "../../../Types/AddressSchema";
import { CreateEventFormValues, CreateEventSchema, createEventValidationSchema, initialValues } from "../../../Types/EventSchema";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { createEvent, fetchAddress } from "../../../APIRoutes";
import Cookies from "universal-cookie";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});



const CreateEvent = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [address, setAddress] = useState<AddressSchema>();
    const [location, setLocation] = useState<LatLngLiteral>({
        lat: 49.868244,
        lng: 8.63907,
    });
    const [markerPosition, setMarkerPosition] = useState<LatLngLiteral>(location);
    let cookies = new Cookies();
    const { colorMode } = useColorMode();

    const handleSubmit = async (values: CreateEventFormValues) => {
        const eventData: CreateEventSchema = {
            title: values.name,
            description: values.description,
            start: values.start,
            end: values.end,
            longitude: location.lng,
            latitude: location.lat,
            private: values.private,
            songSuggestionPrice: values.songSuggestionsPrice,
            messagePrice: values.messagePrice,
        };
        let id: string;
        if (cookies.get('email') != undefined) { //check if email cookie is set
            id = await createEvent(eventData, cookies.get('email'));
        } else { // if not set event can not be created
            id = "0";
        };

        if (id === "0") {
            toast({
                title: "Event could not be created.",
                description: "Something went wrong. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        } else {

            toast({
                title: "Event successfully created.",
                description: "We've created your event for you.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate(`/event-dashboard/${id}`);
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const address = await fetchAddress(location);
            if (address.city !== "") {
                setAddress(address);
            }
        };
        fetch();
    }, [location]);

    useEffect(() => {
        setMarkerPosition(location);
    }, [location]);

    const EventHandlers = ({ form }: { form: FormikProps<CreateEventFormValues> }) => {
        useMapEvents({
            click: (e) => {
                form.setFieldValue("location", e.latlng);
            },
        });

        return null;
    };

    return (
        <Flex direction="column" width="full" align="center" m={"4"} gap={"4"}>
            <Formik
                initialValues={initialValues}
                validationSchema={createEventValidationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <HStack display={"flex"} spacing={"20"} align={"stretch"} mt={"6"}>
                            <Flex direction={"column"} gap={"6"} shadow={colorMode === "dark" ? "dark-lg" : "lg"} p={"4"} borderRadius={"lg"}>
                                <Field name="name" shadow={"lg"}>
                                    {({ field, form }: FieldProps<string, CreateEventFormValues>) => (
                                        <FormControl
                                            isInvalid={!!form.errors.name && form.touched.name}
                                        >
                                            <FormLabel htmlFor="name" fontSize={"lg"}>Name</FormLabel>
                                            <Input
                                                {...field}
                                                id="name"
                                                placeholder="Event Name"
                                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                size="lg"
                                            />
                                            <ErrorMessage name="name" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="description" >
                                    {({ field, form }: FieldProps<string, CreateEventFormValues>) => (
                                        <FormControl
                                            isInvalid={
                                                !!form.errors.description && form.touched.description
                                            }
                                        >
                                            <FormLabel htmlFor="name" fontSize={"lg"}>Description</FormLabel>
                                            <Textarea
                                                {...field}
                                                id="description"
                                                _placeholder={{ opacity: 0.8, color: colorMode === "dark" ? "white" : "black" }}
                                                placeholder="Event Description"
                                                size="lg"
                                            />
                                            <ErrorMessage name="description" />
                                        </FormControl>
                                    )}
                                </Field>
                                <HStack display={"flex"} justifyItems={"center"} >
                                    <Field name="start">
                                        {({ field, form }: FieldProps<Date, CreateEventFormValues>) => (
                                            <FormControl
                                                isInvalid={
                                                    !!form.errors.start && !!form.touched.start
                                                }
                                                zIndex={9999}
                                            >
                                                <FormLabel htmlFor="start" fontSize={"lg"}>Start</FormLabel>
                                                <DatePicker
                                                    selected={field.value}
                                                    onChange={(date) => form.setFieldValue("start", date)}
                                                    showTimeSelect
                                                    dateFormat="dd.MM.yyyy HH:mm"
                                                    customInput={<Input />}
                                                />
                                                <ErrorMessage name="start" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="end">
                                        {({ field, form }: FieldProps<Date, CreateEventFormValues>) => (
                                            <FormControl
                                                isInvalid={!!form.errors.end && !!form.touched.end}
                                                zIndex={9999}
                                            >
                                                <FormLabel htmlFor="end" fontSize={"lg"}>End</FormLabel>
                                                <DatePicker
                                                    selected={field.value}
                                                    onChange={(date) => form.setFieldValue("end", date)}
                                                    showTimeSelect
                                                    dateFormat="dd.MM.yyyy HH:mm"
                                                    customInput={<Input />}
                                                />
                                                <ErrorMessage name="end" />
                                            </FormControl>
                                        )}
                                    </Field>
                                </HStack>
                                <Field name="private">
                                    {({ field, form }: FieldProps<boolean, CreateEventFormValues>) => (
                                        <FormControl
                                            isInvalid={!!form.errors.private && form.touched.private}
                                            p={"4"}
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems={"center"}
                                            borderRadius={"lg"}
                                        >
                                            <FormLabel htmlFor="private-switch" mb="0" fontSize={"lg"}>
                                                {field.value ? "Private" : "Public"}
                                            </FormLabel>
                                            <Switch
                                                id="private-switch"
                                                colorScheme="purple"
                                                size={"lg"}
                                                isChecked={field.value}
                                                onChange={() => form.setFieldValue("private", !field.value)}
                                            />
                                            <ErrorMessage name="private" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Box p={"4"} borderRadius={"lg"}>
                                    <Field name="songSuggestionsPrice">
                                        {({ field, form }: FieldProps<number | null, CreateEventFormValues>) => (
                                            <FormControl
                                                id="songSuggestionsPrice"
                                                isInvalid={
                                                    !!form.errors.songSuggestionsPrice &&
                                                    form.touched.songSuggestionsPrice
                                                }
                                            >
                                                <Flex justifyContent={"space-between"} alignItems={"center"} mt={"2"}>
                                                    <FormLabel fontSize={"lg"}>
                                                        Price Song Suggestions (€)
                                                    </FormLabel>
                                                    <NumberInput
                                                        min={0}
                                                        value={field.value ?? undefined}
                                                        onChange={(valueString) =>
                                                            form.setFieldValue(
                                                                "songSuggestionsPrice",
                                                                Number(valueString)
                                                            )
                                                        }
                                                    >
                                                        <NumberInputField
                                                            {...field}
                                                            value={field.value ? field.value.toString() : ""}
                                                        />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </Flex>
                                                <FormErrorMessage>
                                                    {form.errors.songSuggestionsPrice}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>

                                <Box p={"4"} borderRadius={"lg"}>
                                    <Field name="messagePrice">
                                        {({ field, form }: FieldProps<number | null, CreateEventFormValues>) => (
                                            <FormControl
                                                id="messagePrice"
                                                isInvalid={
                                                    !!form.errors.messagePrice && form.touched.messagePrice
                                                }
                                            >
                                                <Flex justifyContent={"space-between"} alignItems={"center"} mt={"2"}>
                                                    <Tooltip label="Price for sending messages to the host. If 0, messages are disallowed!" bg={"purple.700"} color={"white"} size={"xl"} aria-label="A tooltip">
                                                        <FormLabel fontSize={"lg"}>Message Price (€)</FormLabel>
                                                    </Tooltip>
                                                    <NumberInput
                                                        min={0}
                                                        value={field.value ?? undefined}
                                                        onChange={(valueString) =>
                                                            form.setFieldValue(
                                                                "messagePrice",
                                                                Number(valueString)
                                                            )
                                                        }
                                                    >
                                                        <NumberInputField
                                                            {...field}
                                                            value={field.value ? field.value.toString() : ""}
                                                        />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </Flex>
                                                <FormErrorMessage>
                                                    {form.errors.messagePrice}
                                                </FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>
                            </Flex>

                            <Flex direction={"column"} gap={"16"} shadow={colorMode === "dark" ? "dark-lg" : "lg"} p={"4"} borderRadius={"lg"}>
                                <Field name="location">
                                    {({ field, form }: FieldProps<LatLngLiteral, CreateEventFormValues>) => (
                                        <FormControl
                                            isInvalid={!!form.errors.location && !!form.touched.location}
                                        >
                                            <FormLabel htmlFor="location" fontSize={"lg"}>Location</FormLabel>
                                            <Box
                                                borderRadius="md"
                                                borderWidth={1}
                                                borderColor="purple.300"
                                                overflow={"hidden"}
                                                mb={"2"}
                                            >
                                                <MapContainer
                                                    center={field.value}
                                                    zoom={15}
                                                    style={{ height: "30rem", width: "40rem" }}
                                                >
                                                    <TileLayer
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                    />
                                                    <Marker
                                                        position={markerPosition}
                                                        draggable
                                                        eventHandlers={{
                                                            dragend: (event) => {
                                                                const newLatLng = event.target.getLatLng();
                                                                setMarkerPosition(newLatLng);
                                                                setLocation(newLatLng);
                                                            },
                                                        }}
                                                    ></Marker>
                                                    <EventHandlers form={form} />
                                                </MapContainer>
                                            </Box>
                                            <ErrorMessage name="location" />
                                            <Box
                                                mt={"4"}
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
                                        </FormControl>
                                    )}
                                </Field>
                            </Flex>
                        </HStack>
                        <Flex justifyContent={"end"} mt={"8"}>
                            <Button width="20vh" colorScheme="purple" type="submit" p={"8"}>
                                Create Event
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default CreateEvent;
