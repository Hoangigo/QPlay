"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBet = exports.getEventBets = void 0;
const auctionactivity_model_1 = __importDefault(require("../models/auctionactivity.model"));
const bet_model_1 = __importDefault(require("../models/bet.model"));
// get bets to a given event method
//
const getEventBets = async (req, res) => {
    const auction = await auctionactivity_model_1.default.findOne({ _id: req.params.auctionId }).populate('bets');
    if (!auction) {
        return res.status(404).json({
            error: "auction not found"
        });
    }
    return res.status(200).send(auction.bets);
};
exports.getEventBets = getEventBets;
// create new bet method
//
const createBet = async (req, res) => {
    const auction = await auctionactivity_model_1.default.findOne({ _id: req.params.auctionId });
    if (!auction) {
        return res.status(404).json({
            error: "auction not found"
        });
    }
    // create new bet
    const newBet = new bet_model_1.default({
        songId: req.body.songId,
        price: req.body.price,
        paymentId: req.body.paymentId,
        accepted: false,
    });
    // save bet in auction
    await newBet.save().catch((err) => {
        console.log(err);
        return;
    });
    await auction.updateOne({ $push: { bets: newBet } }).catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(newBet);
};
exports.createBet = createBet;
