"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const suggestionSchema = new Schema({
    songId: String,
    message: String,
    paymentId: String,
    refundId: String,
    accepted: Boolean,
    price: Number,
    suggestedAt: { type: Date, default: Date.now },
    boosted: { type: Boolean, default: false },
    refunded: { type: Boolean, default: false },
});
const suggestionModel = mongoose_1.default.model('Suggestion', suggestionSchema);
exports.default = suggestionModel;
