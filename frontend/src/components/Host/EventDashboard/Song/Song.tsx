import { Card, Stack, CardBody, Heading, Image, Box, Text, useColorMode } from "@chakra-ui/react";
import { SongSchema, mergeArtists } from "../../../../Types/SongSchema";

interface SongProps extends SongSchema {
    width?: string;
    height?: string;
    borderColor?: string;
    isSelected: boolean;
}

const Song = ({ name, artists, images, width, height, borderColor, isSelected }: SongProps) => {
    const { colorMode } = useColorMode();

    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            bg={isSelected ? (colorMode === "dark" ? "purple.900" : "purple.50") : ""}
            border="1px"
            borderColor={borderColor ? borderColor : 'purple.500'}
            borderRadius="md"
            minH={"6rem"}
            w={width}
            h={height}
        >
            <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '100px' }}
                src={images[0].url}
                alt={name}
            />

            <Stack>
                <CardBody>
                    <Box minW={"fit-content"} m="2" justifyContent={"center"} alignItems={"center"}>
                        <Heading size={{ md: 'md', sm: 'sm' }}>
                            {name}
                        </Heading>
                        <Text colorScheme='black' size={{ md: 'md', sm: 'sm' }}>
                            {mergeArtists(artists)}
                        </Text>
                    </Box>
                </CardBody>
            </Stack>
        </Card>
    )
}

export default Song;
