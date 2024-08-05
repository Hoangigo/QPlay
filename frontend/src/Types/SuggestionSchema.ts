import { SongSchema } from "./SongSchema"

export type SuggestionSchema = {
    _id: string,
    song: SongSchema,
    message: string,
    paymentId: string,
    accepted: boolean,
    suggestedAt: Date,
    price: number,
    boosted: boolean,
    refunded: boolean,
    refundId: string,
}

export type CreateSuggestionSchema = {
    songId: string,
    message: string | null,
    paymentId: string,
    suggestedAt: Date
    price: number,
    boosted: boolean,
    refundId: string,
}

export type CreateSuggestionQueryProps = {
    songId: string,
    message: string,
    boosted: boolean,
};