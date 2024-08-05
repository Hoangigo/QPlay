import mongoose from "mongoose";

const Schema = mongoose.Schema;

const betSchema = new Schema({
    songId: String,
    price: Number,
    paymentId: String,
    accepted: Boolean,
});

const betModel = mongoose.model('Bet', betSchema);

export default betModel;