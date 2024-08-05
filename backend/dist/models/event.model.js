"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const eventSchema = new Schema({
    title: String,
    longitude: Number,
    latitude: Number,
    description: String,
    start: Date,
    end: Date,
    private: Boolean,
    messagePrice: Number,
    songSuggestionPrice: Number,
    suggestions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Suggestion",
        },
    ],
    voteActivities: [
        {
            type: Schema.Types.ObjectId,
            ref: "VoteActivity",
        },
    ],
    auctionActivities: [
        {
            type: Schema.Types.ObjectId,
            ref: "AuctionActivity",
        },
    ],
});
const eventModel = mongoose_1.default.model("Event", eventSchema);
exports.default = eventModel;
