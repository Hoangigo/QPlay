"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const hostSchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    resetPasswordToken: Schema.Types.Mixed,
    resetPasswordExpires: Schema.Types.Mixed,
    events: [{
            type: Schema.Types.ObjectId,
            ref: 'Event',
        }],
});
const hostModel = mongoose_1.default.model('Host', hostSchema);
exports.default = hostModel;
