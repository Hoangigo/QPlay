"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventSuggestionData = exports.getEventAuctionData = exports.getEventVoteData = exports.deleteEvent = exports.updateEvent = exports.getEventInfoData = exports.createNewEvent = void 0;
const event_model_1 = __importDefault(require("../models/event.model"));
const host_model_1 = __importDefault(require("../models/host.model"));
const auctionactivity_model_1 = __importDefault(require("../models/auctionactivity.model"));
const voteactivity_model_1 = __importDefault(require("../models/voteactivity.model"));
const bet_model_1 = __importDefault(require("../models/bet.model"));
const suggestion_model_1 = __importDefault(require("../models/suggestion.model"));
const voteoption_model_1 = __importDefault(require("../models/voteoption.model"));
const token_helper_1 = require("../helper/token.helper");
// create new event method 
//
const createNewEvent = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    // create new event
    const newEvent = new event_model_1.default({
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
    const event = await newEvent.save().catch((err) => {
        console.log(err);
        return;
    });
    // search for the host
    const host = await host_model_1.default.findOne({ email: req.params.email });
    if (!host) {
        return res.status(404).json({
            error: "host not found",
        });
    }
    // save event in host
    await host.updateOne({ $push: { events: newEvent } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(event);
};
exports.createNewEvent = createNewEvent;
// get event info data method
//
const getEventInfoData = async (req, res) => {
    const event = await event_model_1.default.findOne({ _id: req.params.id });
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }
    return res.status(200).send(event);
};
exports.getEventInfoData = getEventInfoData;
// update event method
//
const updateEvent = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const event = await event_model_1.default.findOne({ _id: req.params.id });
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }
    // update event
    await event.updateOne(req.body).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(200).send(event);
};
exports.updateEvent = updateEvent;
// delete event method
//
const deleteEvent = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    // delete event
    const event = await event_model_1.default.findOneAndDelete({ _id: req.params.id });
    if (!event) {
        return res.status(404).json({
            error: "event not found"
        });
    }
    // delete event in host
    await host_model_1.default.updateOne({ events: event }, { $pull: { events: event.get('_id') } }).catch((err) => {
        console.log(err);
        return;
    });
    // delete suggestions in event
    const eventSuggestions = event.get('suggestions');
    for (let i = 0; i < eventSuggestions.length; i++) {
        await suggestion_model_1.default.findOneAndDelete({ _id: eventSuggestions[i]._id }).catch((err) => {
            console.log(err);
            return;
        });
    }
    // delete auctions in event
    const eventAuctions = event.get('auctionActivities');
    for (let i = 0; i < eventAuctions.length; i++) {
        let auction = await auctionactivity_model_1.default.findOneAndDelete({ _id: eventAuctions[i]._id });
        // delete bets in auction
        if (auction) {
            let auctionBets = auction.get('bets');
            for (let j = 0; j < auctionBets.length; j++) {
                await bet_model_1.default.findOneAndDelete({ _id: auctionBets[j]._id }).catch((err) => {
                    console.log(err);
                    return;
                });
            }
        }
    }
    // delete votes in event
    const eventVotes = event.get('voteActivities');
    for (let i = 0; i < eventVotes.length; i++) {
        let vote = await voteactivity_model_1.default.findOneAndDelete({ _id: eventVotes[i]._id });
        // delete voteoptions in vote
        if (vote) {
            let voteOptions = vote.get('voteOptions');
            for (let j = 0; j < voteOptions.length; j++) {
                await voteoption_model_1.default.findOneAndDelete({ _id: voteOptions[j]._id }).catch((err) => {
                    console.log(err);
                    return;
                });
            }
        }
    }
    return res.status(204).json({
        title: "event successfully deleted"
    });
};
exports.deleteEvent = deleteEvent;
// get event vote data method
//
const getEventVoteData = async (req, res) => {
    const event = await event_model_1.default.findOne({ _id: req.params.id }).populate({
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
};
exports.getEventVoteData = getEventVoteData;
// get event auction data method
//
const getEventAuctionData = async (req, res) => {
    const event = await event_model_1.default.findOne({ _id: req.params.id }).populate({
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
};
exports.getEventAuctionData = getEventAuctionData;
// get event suggestion data method
//
const getEventSuggestionData = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const event = await event_model_1.default.findOne({ _id: req.params.id }).populate('suggestions');
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }
    return res.status(200).send(event);
};
exports.getEventSuggestionData = getEventSuggestionData;
