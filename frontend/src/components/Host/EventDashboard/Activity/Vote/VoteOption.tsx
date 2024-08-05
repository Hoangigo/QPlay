import { Flex, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import Song from '../../Song/Song';
import { VoteOptionSchema } from "../../../../../Types/VoteSchema";

interface VoteOptionProps {
    voteStat: VoteOptionSchema;
    totalVotes: number;
    progressColor: string;
}


const VoteOption = ({ voteStat, totalVotes, progressColor }: VoteOptionProps) => {

    return (
        <Flex key={voteStat.song.id} justifyContent={"center"} align={"center"} gap="2rem" bgSize={"contain"}>
            <Flex>
                <Song
                    name={voteStat.song.name}
                    artists={voteStat.song.artists}
                    images={voteStat.song.images}
                    id={voteStat.song.id}
                    width={"25rem"}
                    height={"7rem"}
                    borderColor={progressColor}
                    isSelected={false}
                />
            </Flex>
            <CircularProgress color={progressColor ? progressColor : 'purple.500'} value={(voteStat.count / totalVotes) * 100} size={"6rem"}>
                <CircularProgressLabel>{voteStat.count}</CircularProgressLabel>
            </CircularProgress>
        </Flex>
    );
};
export default VoteOption;
