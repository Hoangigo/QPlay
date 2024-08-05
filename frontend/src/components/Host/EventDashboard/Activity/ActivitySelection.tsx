import { VStack, Tabs, TabList, Tab, TabPanels, TabPanel, Heading } from "@chakra-ui/react";
import AuctionForm from "./Auction/AuctionForm";
import VoteForm from './Vote/VoteForm';
import { SetStateAction, useState } from "react";

export enum ActivityState {
    NONE,
    AUCTION,
    VOTING
}

const ActivitySelection = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (index: SetStateAction<number>) => {
        setSelectedTab(index);
    };

    return (
        <VStack>
            <Heading as="h1" size="xl" textAlign="center" mb={4}>
                Select activity
            </Heading>
            <Tabs onChange={handleTabChange} index={selectedTab} isFitted variant='enclosed' colorScheme="purple">
                <TabList>
                    <Tab fontSize="xl" py={4} px={6} _hover={{ borderBottomColor: "purple.300" }} cursor="pointer">
                        Voting
                    </Tab>
                    <Tab fontSize="xl" py={4} px={6} _hover={{ borderBottomColor: "purple.300" }} cursor="pointer">
                        Auction
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <VoteForm />
                    </TabPanel>
                    <TabPanel>
                        <AuctionForm />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

export default ActivitySelection;
