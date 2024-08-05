import mongoose from "mongoose";

const Schema = mongoose.Schema;

const voteOptionSchema = new Schema({
    songId: String,
    count: { type: Number, default: 0 },
});

const voteOptionModel = mongoose.model('VoteOption', voteOptionSchema);

export default voteOptionModel;