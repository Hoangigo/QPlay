import { Box, Flex, Badge, Progress } from "@chakra-ui/react"

interface ActiveHeaderProps {
    remainingTime: number;
    type: string;
    totalValue: number;
    duration: number;
}

const ActiveHeader = ({ remainingTime, type, totalValue, duration }: ActiveHeaderProps) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    const timeDisplay = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} mb={"4"}>
            {totalValue > 0 &&
                <Flex gap={4} mt={"4"}>
                    <Badge colorScheme="purple" fontSize="xl" fontWeight="bold" mb={2} borderRadius={"md"}>
                        {type === "auction" ? "Total bets:" : "Total votes:"}
                    </Badge>
                    <Badge colorScheme="yellow" variant="outline" fontSize="xl" fontWeight="bold" mb={2} borderRadius={"md"}>
                        {totalValue}
                    </Badge>
                </Flex>}
            {remainingTime > 0 &&
                <Flex justifyContent={"center"} align={"center"} gap="8" bgSize={"contain"} mt={"4"}>
                    <Box>
                        <Badge colorScheme="purple" fontSize="xl" fontWeight="bold" mb={2} mr={"2"} borderRadius={"md"}>
                            Time remaining:
                        </Badge>
                        <Badge colorScheme="orange" variant="outline" fontSize="xl" fontWeight="bold" mb={2} borderRadius={"md"}>
                            {timeDisplay}
                        </Badge>
                        <Progress colorScheme="purple" value={remainingTime} max={duration} />
                    </Box>
                </Flex>}
        </Box>
    )
}

export default ActiveHeader;
