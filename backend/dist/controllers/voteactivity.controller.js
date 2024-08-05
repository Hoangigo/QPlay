"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVote = exports.createVote = exports.getVote = void 0;
const voteactivity_model_1 = __importDefault(require("../models/voteactivity.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const voteoption_model_1 = __importDefault(require("../models/voteoption.model"));
const token_helper_1 = require("../helper/token.helper");
// get vote method 
//
const getVote = async (req, res) => {
    // search given vote
    const vote = await voteactivity_model_1.default.findOne({ _id: req.params.id }).populate('voteOptions');
    if (!vote) {
        return res.status(404).json({
            error: "no vote found"
        });
    }
    return res.status(200).send(vote);
};
exports.getVote = getVote;
// create vote method
//
const createVote = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    // search given event
    const event = await event_model_1.default.findOne({ _id: req.params.eventId });
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }
    // create new vote
    const newVote = new voteactivity_model_1.default({
        start: req.body.start,
        end: req.body.end,
    });
    await newVote.save().catch((err) => {
        console.log(err);
        return;
    });
    // create vote options
    const voteOptions = req.body.voteOptions;
    for (let i = 0; i < voteOptions.length; i++) {
        let voteOption = new voteoption_model_1.default({
            ...voteOptions[i]
        });
        // add option to vote
        await voteOption.save().catch((err) => {
            console.log(err);
            return;
        });
        await newVote.updateOne({ $push: { voteOptions: voteOption } }).catch((err) => {
            console.log(err);
            return;
        });
    }
    // add vote to given event
    await event.updateOne({ $push: { voteActivities: newVote } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(newVote);
};
exports.createVote = createVote;
// delete vote method
//
const deleteVote = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    // delete vote
    const vote = await voteactivity_model_1.default.findOneAndDelete({ _id: req.params.id });
    if (!vote) {
        return res.status(404).json({
            title: "vote not found"
        });
    }
    // delete voteoptions in vote
    const voteOptions = vote.get('voteOptions');
    for (let i = 0; i < voteOptions.length; i++) {
        await voteoption_model_1.default.findOneAndDelete({ _id: voteOptions[i]._id }).catch((err) => {
            console.log(err);
            return;
        });
    }
    // delete vote in the event
    await event_model_1.default.updateOne({ voteActivities: vote }, { $pull: { voteActivities: vote.get('_id') } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(204).json({
        title: "vote successfully deleted"
    });
};
exports.deleteVote = deleteVote;
