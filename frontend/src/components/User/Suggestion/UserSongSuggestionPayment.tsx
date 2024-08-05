import { Flex, Heading, Spinner, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { createSuggestion, executePayment } from "../../../APIRoutes";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CreateSuggestionSchema } from "../../../Types/SuggestionSchema";

const UserSongSuggestionPayment = () => {
    const [searchParams] = useSearchParams();
    const { eventId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            // get queries
            const token = searchParams.get('token');
            const boosted = searchParams.get('boosted');
            const message = searchParams.get('message');
            const songId = searchParams.get('songId');
            const price = searchParams.get('price');

            if (token && eventId && boosted && price && songId) {
                // execute payment
                const payment = await executePayment(token, parseInt(price));

                // payment approved
                if (payment.result.status === "COMPLETED") {
                    const refundId = payment.result.purchase_units[0].payments.captures[0].id;
                    const suggestion: CreateSuggestionSchema = {
                        boosted: boosted === "true" ? true : false,
                        message: message !== null ? decodeURIComponent(message) : "",
                        suggestedAt: new Date(),
                        songId: songId,
                        price: parseInt(price),
                        paymentId: token,
                        refundId: refundId,
                    };
                    const suggestionResponse = await createSuggestion(eventId, suggestion);

                    if (suggestionResponse) {
                        toast({
                            title: "Payment success",
                            description: "Successfully created your suggestion",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                        navigate(`/user/event-overview/${eventId}`);
                    } else {

                    }
                } else {
                    toast({
                        title: "Payment failed",
                        description: "Your payment failed. Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                    navigate(`/user/event-overview/${eventId}`);
                }
            } else {
                navigate(`/user/event-overview/${eventId}`);
            }
        }
        fetchData();
    }, [searchParams])

    return (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" textAlign="center" mt={10}>
            <Heading>Please wait, we try to process your payment ...</Heading>
            <Spinner mt={5} />
        </Flex>
    );
}

export default UserSongSuggestionPayment;