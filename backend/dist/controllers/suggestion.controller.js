"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSuggestion = exports.deleteSuggestion = exports.createSuggestion = exports.getEventSuggestions = void 0;
const suggestion_model_1 = __importDefault(require("../models/suggestion.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const token_helper_1 = require("../helper/token.helper");
// get event suggestion method
//
const getEventSuggestions = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const event = await event_model_1.default.findOne({ _id: req.params.eventId }).populate('suggestions');
    // no suggestions in db
    if (!event) {
        return res.status(404).json({
            error: "no event found"
        });
    }
    return res.status(200).send(event.suggestions);
};
exports.getEventSuggestions = getEventSuggestions;
// create suggestion method
//
const createSuggestion = async (req, res) => {
    const event = await event_model_1.default.findOne({ _id: req.params.eventId });
    // event does not exist
    if (!event) {
        return res.status(404).json({
            error: "event not found"
        });
    }
    // create new suggest
    const newSuggestion = new suggestion_model_1.default({
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
    await newSuggestion.save().catch((err) => {
        console.log(err);
        return;
    });
    await event.updateOne({ $push: { suggestions: newSuggestion } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(newSuggestion);
};
exports.createSuggestion = createSuggestion;
// delete suggestion method
//
const deleteSuggestion = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    // delete suggestion
    const suggestion = await suggestion_model_1.default.findOneAndDelete({ _id: req.params.id });
    if (!suggestion) {
        return res.status(404).send({
            title: "suggestion not found"
        });
    }
    // delete suggestion in event
    await event_model_1.default.updateOne({ suggestions: suggestion }, { $pull: { suggestions: suggestion.get('_id') } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(204).json({
        title: "succesfully deleted"
    });
};
exports.deleteSuggestion = deleteSuggestion;
// update suggestion method
//
const updateSuggestion = async (req, res) => {
    const suggestion = await suggestion_model_1.default.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }); // return the updated object
    if (!suggestion) {
        return res.status(404).json({
            error: "suggestion not found"
        });
    }
    // suggestion is accepted
    await suggestion.save().catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(suggestion);
};
exports.updateSuggestion = updateSuggestion;
