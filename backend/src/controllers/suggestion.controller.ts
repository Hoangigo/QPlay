import { Request, Response } from "express";
import Suggestion from '../models/suggestion.model';
import Event from '../models/event.model';
import { checkRequestForToken } from "../helper/token.helper";

// get event suggestion method
//
export const getEventSuggestions = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token


    const event = await Event.findOne({ _id: req.params.eventId }).populate('suggestions');

    // no suggestions in db
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }

    return res.status(200).send(event.suggestions);
}

// create suggestion method
//
export const createSuggestion = async (req: Request, res: Response) => {
    const event = await Event.findOne({ _id: req.params.eventId });

    // event does not exist
    if (!event) {
        return res.status(404).json({
            error: "event not found"
        });
    }

    // create new suggest
    const newSuggestion = new Suggestion({
        songId: req.body.songId,
        message: req.body.message,
        paymentId: req.body.paymentId,
        accepted: false,
        price: req.body.price,
        boosted: req.body.boosted,
        refunded: false,
        refundId: req.body.refundId,
    });

    // add suggestion to given event
    await newSuggestion.save().catch((err: any) => {
        console.log(err);
        return;
    });
    await event.updateOne({ $push: { suggestions: newSuggestion } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(newSuggestion);
}

// delete suggestion method
//
export const deleteSuggestion = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    // delete suggestion
    const suggestion = await Suggestion.findOneAndDelete({ _id: req.params.id });

    if (!suggestion) {
        return res.status(404).send({
            title: "suggestion not found"
        });
    }

    // delete suggestion in event
    await Event.updateOne({ suggestions: suggestion }, { $pull: { suggestions: suggestion.get('_id') } }).catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(204).json({
        title: "succesfully deleted"
    });
}

// update suggestion method
//
export const updateSuggestion = async (req: Request, res: Response) => {
    const suggestion = await Suggestion.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // return the updated object

    if (!suggestion) {
        return res.status(404).json({
            error: "suggestion not found"
        });
    }

    // suggestion is accepted
    await suggestion.save().catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(suggestion);
}