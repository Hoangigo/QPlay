import { Request, Response } from "express";
import Vote from "../models/voteactivity.model"
import Event from "../models/event.model";
import VoteOption from "../models/voteoption.model";
import { checkRequestForToken } from "../helper/token.helper";

// get vote method 
//
export const getVote = async (req: Request, res: Response) => {
    // search given vote
    const vote = await Vote.findOne({ _id: req.params.id }).populate('voteOptions');

    if (!vote) {
        return res.status(404).json({
            error: "no vote found"
        });
    }

    return res.status(200).send(vote);
}

// create vote method
//
export const createVote = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    // search given event
    const event = await Event.findOne({ _id: req.params.eventId });

    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    // create new vote
    const newVote = new Vote({
        start: req.body.start,
        end: req.body.end,
    });

    await newVote.save().catch((err: any) => {
        console.log(err);
        return;
    });

    // create vote options
    const voteOptions = req.body.voteOptions;
    for (let i = 0; i < voteOptions.length; i++) {
        let voteOption = new VoteOption({
            ...voteOptions[i]
        });

        // add option to vote
        await voteOption.save().catch((err: any) => {
            console.log(err);
            return;
        });
        await newVote.updateOne({ $push: { voteOptions: voteOption } }).catch((err: any) => {
            console.log(err);
            return;
        });
    }

    // add vote to given event
    await event.updateOne({ $push: { voteActivities: newVote } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(newVote);
}

// delete vote method
//
export const deleteVote = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    // delete vote
    const vote = await Vote.findOneAndDelete({ _id: req.params.id });

    if (!vote) {
        return res.status(404).json({
            title: "vote not found"
        });
    }

    // delete voteoptions in vote
    const voteOptions = vote.get('voteOptions');
    for (let i = 0; i < voteOptions.length; i++) {
        await VoteOption.findOneAndDelete({ _id: voteOptions[i]._id  }).catch((err: any) => {
            console.log(err);
            return;
        });
    }

    // delete vote in the event
    await Event.updateOne({ voteActivities: vote }, { $pull: { voteActivities: vote.get('_id') } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(204).json({
        title: "vote successfully deleted"
    });
}