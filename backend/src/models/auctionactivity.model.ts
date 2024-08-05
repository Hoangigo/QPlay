import mongoose from "mongoose";

const Schema = mongoose.Schema;

const auctionActivitySchema = new Schema({
    start: { type: Date, default: Date.now },
    end: Date,
    startPrice: Number,
    bets: [{
        type: Schema.Types.ObjectId,
        ref: 'Bet',
    }],
});

const auctionActivityModel = mongoose.model('AuctionActivity', auctionActivitySchema);

export default auctionActivityModel;