import { Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Box } from "@chakra-ui/react";
import { useState, SetStateAction, useEffect } from "react";
import HostInformationData from "./HostInformation";
import CreateEvent from "../Event/CreateEvent";
import EventList from "../Event/EventList";
import { useNavigate, useParams } from "react-router-dom";

const HostDashboard = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const { tabIndex } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        tabIndex ? setSelectedTab(parseInt(tabIndex)) : setSelectedTab(0);
    }, [tabIndex]);

    const handleTabChange = (index: SetStateAction<number>) => {
        navigate(`/host-dashboard/${index}`);
    };

    return (
        <Box w="100vw" h="100vh" overflowY="auto" overflowX="hidden" border={"1px"} borderColor={"purple.50"} borderRadius={"2xl"} mt={"4"}>
            <Flex direction={"column"}>
                <Tabs onChange={handleTabChange} index={selectedTab} isFitted variant='enclosed' colorScheme="purple">
                    <TabList>
                        <Tab fontSize="xl" py={4} px={6} _hover={{ borderBottomColor: "purple.300" }} cursor="pointer">
                            Host data
                        </Tab>
                        <Tab fontSize="xl" py={4} px={6} _hover={{ borderBottomColor: "purple.300" }} cursor="pointer">
                            Create event
                        </Tab>
                        <Tab fontSize="xl" py={4} px={6} _hover={{ borderBottomColor: "purple.300" }} cursor="pointer">
                            Show events
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel key={selectedTab === 0 ? 'hostData' : ''} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <HostInformationData />
                        </TabPanel>
                        <TabPanel key={selectedTab === 1 ? 'createEvent' : ''}>
                            <CreateEvent />
                        </TabPanel>
                        <TabPanel key={selectedTab === 2 ? 'showEvents' : ''}>
                            <EventList />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Flex>
        </Box>
    )
}

export default HostDashboard;
