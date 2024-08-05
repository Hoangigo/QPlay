import { Request, Response } from "express";
import Auction from "../models/auctionactivity.model"
import Bet from "../models/bet.model";

// get bets to a given event method
//
export const getEventBets = async (req: Request, res: Response) => {
    const auction = await Auction.findOne({ _id: req.params.auctionId }).populate('bets');

    if (!auction) {
        return res.status(404).json({
            error: "auction not found"
        });
    }

    return res.status(200).send(auction.bets);
}

// create new bet method
//
export const createBet = async (req: Request, res: Response) => {
    const auction = await Auction.findOne({ _id: req.params.auctionId });

    if (!auction) {
        return res.status(404).json({
            error: "auction not found"
        });
    }

    // create new bet
    const newBet = new Bet({
        songId: req.body.songId,
        price: req.body.price,
        paymentId: req.body.paymentId,
        accepted: false,
    });


    // save bet in auction
    await newBet.save().catch((err: any) => {
        console.log(err);
        return;
    }); 
    await auction.updateOne({ $push: { bets: newBet } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(newBet);
}