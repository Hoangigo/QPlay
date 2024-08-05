import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

const hostModel = mongoose.model('Host', hostSchema);

export default hostModel;