import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <Box p={8} maxW={"70vh"} flexDirection={"column"} display={"flex"} justifyContent={"center"} alignItems={"center"} m={"auto"}>
            <Heading as="h2" size="xl" mb={6}>
                Terms
            </Heading>
            <Text>
                QPlay offers services under the following terms and conditions.
                By using the QPlay platform, including all associated features and services,
                you fully accept these terms and conditions. Please read them carefully.
            </Text>
            <Button colorScheme="purple" marginTop={"4"} size="lg" mt={4} onClick={() => { navigate("/login") }}>
                Back
            </Button>
        </Box>
    );
};

export default Terms;
