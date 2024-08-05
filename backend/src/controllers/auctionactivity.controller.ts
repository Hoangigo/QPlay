import { Request, Response } from "express";
import Auction from "../models/auctionactivity.model";
import Event from "../models/event.model";
import Bet from "../models/bet.model";
import { checkRequestForToken } from "../helper/token.helper";

// create auction method
//
export const createAuction = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const event = await Event.findOne({ _id: req.params.eventId });

    if (!event) {
        return res.status(404).json({
            error: "no event found",
        });
    }

    // create new auction
    const newAuction = new Auction({
        start: req.body.start,
        end: req.body.end,
        startPrice: req.body.startPrice,
    });

    await newAuction.save().catch((err: any) => {
        console.log(err);
        return;
    });

    // add auction to given event
    await event.updateOne({ $push: { auctionActivities: newAuction } });

    return res.status(201).send(newAuction);
}

// delete auction method
//
export const deleteAuction = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const auction = await Auction.findOneAndDelete({ _id: req.params.id });

    if (!auction) {
        return res.status(404).json({
            title: "auction not found"
        });
    }

    // delete bets from auction
    const auctionBets = auction.get('bets');
    for (let i = 0; i < auctionBets.length; i++) {
        await Bet.findOneAndDelete({ _id: auctionBets[i]._id  }).catch((err: any) => {
            console.log(err);
            return;
        });
    }

    // delete auction in the event
    await Event.updateOne({ auctionActivities: auction }, { $pull: { auctionActivities: auction.get('_id') } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(204).json({
        title: "event successfully deleted"
    });
}