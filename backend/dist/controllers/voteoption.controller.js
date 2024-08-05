"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOptionCount = void 0;
const voteoption_model_1 = __importDefault(require("../models/voteoption.model"));
// update voteoption count method
//
const updateOptionCount = async (req, res) => {
    const voteOption = await voteoption_model_1.default.findOneAndUpdate({ _id: req.body._id }, { $inc: { count: 1 } }, { new: true }).catch((err) => {
        return res.status(400).json({
            error: err
        });
    });
    return res.status(200).send(voteOption);
};
exports.updateOptionCount = updateOptionCount;
