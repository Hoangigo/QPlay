import { Badge, Card, CardBody, Flex, Image } from "@chakra-ui/react";
import { BetSchema } from "../../../../../Types/AuctionSchema";
import { mergeArtists } from "../../../../../Types/SongSchema";

interface CurrentBestBetProps {
    topBet?: BetSchema;
    width?: string;
    height?: string;
    borderColor?: string;
}

const CurrentBestBet = ({ topBet, width, height, borderColor }: CurrentBestBetProps) => {
    return (
        topBet ?
            <Flex
                direction={{ base: 'column', sm: 'row' }}
                align="center"
                w={width}
                h={height}
                alignSelf="center"
            >
                <Card
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                    border="1px"
                    borderColor={borderColor ? borderColor : 'yellow.200'}
                    borderRadius="md"
                    minH={"6rem"}
                    w="100%"
                >
                    <Image
                        objectFit='cover'
                        w="100%"
                        h={{ base: '150px', sm: '240px' }}
                        maxW={{ base: '100%', sm: '360px' }}
                        src={topBet.song.images[0].url}
                        alt={topBet.song.name}
                    />
                    <CardBody>
                        <Flex direction="column" gap={"8"} align={"center"}>
                            <Badge colorScheme="yellow" fontSize={{ base: "md", sm: "2xl" }} variant={"subtle"} borderRadius={"md"}>
                                {topBet.song.name}
                            </Badge>
                            <Badge colorScheme="yellow" fontSize={{ base: "sm", sm: "xl" }} variant={"subtle"} borderRadius={"md"}>
                                {mergeArtists(topBet.song.artists)}
                            </Badge>
                            <Badge colorScheme="yellow" fontSize={{ base: "2xl", sm: "4xl" }} fontWeight={"extrabold"} variant={"outline"} borderRadius={"md"}>
                                {topBet.price}€
                            </Badge>
                        </Flex>
                    </CardBody>
                </Card>
            </Flex >
            :
            null
    );
}

export default CurrentBestBet;
