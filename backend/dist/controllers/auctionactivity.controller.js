"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuction = exports.createAuction = void 0;
const auctionactivity_model_1 = __importDefault(require("../models/auctionactivity.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const bet_model_1 = __importDefault(require("../models/bet.model"));
const token_helper_1 = require("../helper/token.helper");
// create auction method
//
const createAuction = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const event = await event_model_1.default.findOne({ _id: req.params.eventId });
    if (!event) {
        return res.status(404).json({
            error: "no event found",
        });
    }
    // create new auction
    const newAuction = new auctionactivity_model_1.default({
        start: req.body.start,
        end: req.body.end,
        startPrice: req.body.startPrice,
    });
    await newAuction.save().catch((err) => {
        console.log(err);
        return;
    });
    // add auction to given event
    await event.updateOne({ $push: { auctionActivities: newAuction } });
    return res.status(201).send(newAuction);
};
exports.createAuction = createAuction;
// delete auction method
//
const deleteAuction = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const auction = await auctionactivity_model_1.default.findOneAndDelete({ _id: req.params.id });
    if (!auction) {
        return res.status(404).json({
            title: "auction not found"
        });
    }
    // delete bets from auction
    const auctionBets = auction.get('bets');
    for (let i = 0; i < auctionBets.length; i++) {
        await bet_model_1.default.findOneAndDelete({ _id: auctionBets[i]._id }).catch((err) => {
            console.log(err);
            return;
        });
    }
    // delete auction in the event
    await event_model_1.default.updateOne({ auctionActivities: auction }, { $pull: { auctionActivities: auction.get('_id') } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(204).json({
        title: "event successfully deleted"
    });
};
exports.deleteAuction = deleteAuction;
