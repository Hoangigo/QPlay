import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <Box p={8} maxW={"70vh"} flexDirection={"column"} display={"flex"} justifyContent={"center"} alignItems={"center"} m={"auto"}>
            <Heading as="h2" size="xl" mb={6}>
                Privacy
            </Heading>
            <Text>
                At QPlay, we respect and protect the privacy of our users.
                This privacy policy describes how we collect, use, and protect
                the personal data you provide to us when using our services.
                This privacy policy applies to all users of our mobile application
                and our website.
            </Text>
            <Button colorScheme="purple" marginTop={"4"} size="lg" mt={4} onClick={() => { navigate("/login") }}>
                Back
            </Button>

        </Box>
    );
};

export default Privacy;
