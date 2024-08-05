import mongoose from "mongoose";

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  longitude: Number,
  latitude: Number,
  description: String,
  start: Date,
  end: Date,
  private: Boolean,
  messagePrice: Number,
  songSuggestionPrice: Number,
  suggestions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Suggestion",
    },
  ],
  voteActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: "VoteActivity",
    },
  ],
  auctionActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: "AuctionActivity",
    },
  ],
});

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;
