import { SongSchema } from "./SongSchema";

export type BetSchema = {
    _id: string;
    price: number;
    song: SongSchema;
    paymentId: string;
    accepted: boolean;
}

export type CreateBetSchema = {
    price: number;
    songId: string;
    paymentId: string;
}

export type AuctionSchema = {
    _id: string;
    startPrice: number;
    start: Date;
    end: Date;
    bets: BetSchema[];
}

export type CreateAuctionSchema = {
    startPrice: number;
    start: Date;
    end: Date;
}

export type CreateBetQueryProps = {
    price: number; 
    songId: string;
}

export const getActiveAuction = (auctions: AuctionSchema[]): AuctionSchema => {
    const currentTime = new Date();

    for (const auction of auctions) {
        const startDate = new Date(auction.start);
        const endDate = new Date(auction.end);
        if (currentTime >= startDate && currentTime <= endDate) {
            return auction;
        }
    }

    return {} as AuctionSchema;
}
