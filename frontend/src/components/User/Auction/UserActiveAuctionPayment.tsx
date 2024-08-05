import { Flex, Heading, Spinner, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createBet, executePayment } from "../../../APIRoutes";
import { CreateBetSchema } from "../../../Types/AuctionSchema";

const UserActiveAuctionPayment = () => {
    const [searchParams] = useSearchParams();
    const { eventId } = useParams();
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            // get queries
            const songId = searchParams.get('songId');
            const price = searchParams.get('price');
            const token = searchParams.get('token');
            const auctionId = searchParams.get('auctionId');

            if (eventId && songId && price && token && auctionId) {
                const payment = await executePayment(token, parseInt(price));

                if (payment.result.status === "COMPLETED") {
                    const bet: CreateBetSchema = {
                        price: parseInt(price),
                        songId: songId,
                        paymentId: token,
                    };

                    // create bet
                    const betResponse = await createBet(auctionId, bet);

                    if (betResponse) {
                        toast({
                            title: "Payment success",
                            description: "Successfully created your bet",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                        navigate(`/user/event-overview/${eventId}`);
                    } else {
                        toast({
                            title: "Failed while creating",
                            description: "Bet could not be created",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                        navigate(`/user/event-overview/${eventId}`);
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
    }, []);

    return(
        <Flex flexDirection="column" justifyContent="center" alignItems="center" textAlign="center" mt={10}>
            <Heading>Please wait, we try to process your payment ...</Heading>
            <Spinner mt={5} />
        </Flex>
    );
}

export default UserActiveAuctionPayment;