"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const voteActivitySchema = new Schema({
    start: { type: Date, default: Date.now },
    end: Date,
    voteOptions: [{
            type: Schema.Types.ObjectId,
            ref: 'VoteOption',
        }],
});
const voteActivityModel = mongoose_1.default.model('VoteActivity', voteActivitySchema);
exports.default = voteActivityModel;
