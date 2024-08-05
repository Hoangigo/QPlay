import { SongSchema } from "./SongSchema";

export type VoteOptionSchema = {
    _id: string;
    song: SongSchema
    count: number;
}

export type CreateVoteOptionSchema = {
    songId: string;
    count: number;
}

export type VoteSchema = {
    _id: string;
    start: Date;
    end: Date;
    voteOptions: VoteOptionSchema[];
}

export type CreateVoteSchema = {
    start: Date;
    end: Date;
    voteOptions: CreateVoteOptionSchema[];
}



export const getActiveVote = (votes: VoteSchema[]): VoteSchema => {
    const currentTime = new Date();

    for (const vote of votes) {
        const startDate = new Date(vote.start);
        const endDate = new Date(vote.end);
        if (currentTime >= startDate && currentTime <= endDate) {

            return vote;
        }
    }


    return {} as VoteSchema;
}