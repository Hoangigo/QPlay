"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const auctionActivitySchema = new Schema({
    start: { type: Date, default: Date.now },
    end: Date,
    startPrice: Number,
    bets: [{
            type: Schema.Types.ObjectId,
            ref: 'Bet',
        }],
});
const auctionActivityModel = mongoose_1.default.model('AuctionActivity', auctionActivitySchema);
exports.default = auctionActivityModel;
