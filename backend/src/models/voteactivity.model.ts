import mongoose from "mongoose";

const Schema = mongoose.Schema;

const voteActivitySchema = new Schema({
    start: { type: Date, default: Date.now },
    end: Date,
    voteOptions: [{
        type: Schema.Types.ObjectId,
        ref: 'VoteOption',
    }],
});

const voteActivityModel = mongoose.model('VoteActivity', voteActivitySchema);

export default voteActivityModel;