import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

const suggestionModel = mongoose.model('Suggestion', suggestionSchema);

export default suggestionModel;