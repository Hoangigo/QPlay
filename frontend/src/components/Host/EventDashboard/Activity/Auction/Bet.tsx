import { Badge, Box, Flex } from "@chakra-ui/react";
import { BetSchema } from "../../../../../Types/AuctionSchema";
import Song from "../../Song/Song";



const Bet = (bet: BetSchema, isSelected: boolean) => {
    return (
        <Box bg={"purple.900"} >
            <Flex justifyContent={"center"} align={"center"} gap={"4"} border={"1px"} borderRadius={"lg"}>
                <Song {...bet.song} width="25rem" height="6rem" isSelected={isSelected} />
                <Badge colorScheme="yellow" fontSize="2xl" variant={"outline"} mr="4" borderRadius={"md"}>
                    {bet.price}€
                </Badge>
            </Flex>
        </Box>
    );
}

export default Bet;