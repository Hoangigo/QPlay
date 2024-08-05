import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <Box p={8} maxW={"70vh"} flexDirection={"column"} display={"flex"} justifyContent={"center"} alignItems={"center"} m={"auto"}>
            <Heading as="h2" size="xl" mb={6}>
                About
            </Heading>
            <Text>
                QPlay is an innovative company that offers a digital solution for the traditional
                queueing problem in clubs, bars, and pubs. We see ourselves as a kind of digital
                jukebox, allowing users to manage their place in the queue comfortably from their
                smartphone, while having the freedom to use their time as they wish. Our goal is
                to make nightlife simpler and more enjoyable.
            </Text>
            <Button colorScheme="purple" marginTop={"4"} size="lg" mt={4} onClick={() => { navigate("/login") }}>
                Back
            </Button>
        </Box>
    );
};

export default About;
