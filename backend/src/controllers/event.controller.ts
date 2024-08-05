import { Request, Response } from "express";
import Event from "../models/event.model";
import Host from "../models/host.model";
import Auction from "../models/auctionactivity.model";
import Vote from "../models/voteactivity.model";
import Bet from "../models/bet.model";
import Suggestion from "../models/suggestion.model";
import VoteOption from "../models/voteoption.model";
import { checkRequestForToken } from "../helper/token.helper";

// create new event method 
//
export const createNewEvent = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    // create new event
    const newEvent = new Event({
        title: req.body.title,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        description: req.body.description,
        start: req.body.start,
        end: req.body.end,
        private: req.body.private,
        messagePrice: req.body.messagePrice,
        songSuggestionPrice: req.body.songSuggestionPrice,
    });

    // save event
    const event = await newEvent.save().catch((err: any) => {
        console.log(err);
        return;
    });

    // search for the host
    const host = await Host.findOne({ email: req.params.email });

    if (!host) {
        return res.status(404).json({
            error: "host not found",
        });
    }

    // save event in host
    await host.updateOne({ $push: { events: newEvent } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(event);
}

// get event info data method
//
export const getEventInfoData = async (req: Request, res: Response) => {
    const event = await Event.findOne({ _id: req.params.id });

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    return res.status(200).send(event);
}

// update event method
//
export const updateEvent = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const event = await Event.findOne({ _id: req.params.id });

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    // update event
    await event.updateOne(req.body).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(200).send(event);
}

// delete event method
//
export const deleteEvent = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    // delete event
    const event = await Event.findOneAndDelete({ _id: req.params.id });

    if (!event) {
        return res.status(404).json({
            error: "event not found"
        });
    }

    // delete event in host
    await Host.updateOne({ events: event }, { $pull: { events: event.get('_id') } }).catch((err: any) => {
        console.log(err);
        return;
    });

    // delete suggestions in event
    const eventSuggestions = event.get('suggestions');
    for (let i = 0; i < eventSuggestions.length; i++) {
        await Suggestion.findOneAndDelete({ _id: eventSuggestions[i]._id }).catch((err: any) => {
            console.log(err);
            return;
        });
    }

    // delete auctions in event
    const eventAuctions = event.get('auctionActivities');
    for (let i = 0; i < eventAuctions.length; i++) {
        let auction = await Auction.findOneAndDelete({ _id: eventAuctions[i]._id });

        // delete bets in auction
        if (auction) {
            let auctionBets = auction.get('bets');
            for (let j = 0; j < auctionBets.length; j++) {
                await Bet.findOneAndDelete({ _id: auctionBets[j]._id }).catch((err: any) => {
                    console.log(err);
                    return;
                });
            }
        }
    }

    // delete votes in event
    const eventVotes = event.get('voteActivities');
    for (let i = 0; i < eventVotes.length; i++) {
        let vote = await Vote.findOneAndDelete({ _id: eventVotes[i]._id });

        // delete voteoptions in vote
        if (vote) {
            let voteOptions = vote.get('voteOptions');
            for (let j = 0; j < voteOptions.length; j++) {
                await VoteOption.findOneAndDelete({ _id: voteOptions[j]._id }).catch((err: any) => {
                    console.log(err);
                    return;
                });
            }
        }
    }

    return res.status(204).json({
        title: "event successfully deleted"
    });
}

// get event vote data method
//
export const getEventVoteData = async (req: Request, res: Response) => {
    const event = await Event.findOne({ _id: req.params.id }).populate({
        path: 'voteActivities',
        populate: {
            path: 'voteOptions',
        }
    });

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    return res.status(200).send(event);
}

// get event auction data method
//
export const getEventAuctionData = async (req: Request, res: Response) => {
    const event = await Event.findOne({ _id: req.params.id }).populate({
        path: 'auctionActivities',
        populate: {
            path: 'bets',
        }
    });

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    return res.status(200).send(event);
}

// get event suggestion data method
//
export const getEventSuggestionData = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const event = await Event.findOne({ _id: req.params.id }).populate('suggestions');

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    return res.status(200).send(event);
}
