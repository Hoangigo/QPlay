"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const voteOptionSchema = new Schema({
    songId: String,
    count: { type: Number, default: 0 },
});
const voteOptionModel = mongoose_1.default.model('VoteOption', voteOptionSchema);
exports.default = voteOptionModel;
