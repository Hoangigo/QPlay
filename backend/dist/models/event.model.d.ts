import mongoose from "mongoose";
declare const eventModel: mongoose.Model<{
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
}> & Omit<{
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
}>> & Omit<mongoose.FlatRecord<{
    suggestions: mongoose.Types.ObjectId[];
    voteActivities: mongoose.Types.ObjectId[];
    auctionActivities: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    title?: string | undefined;
    longitude?: number | undefined;
    latitude?: number | undefined;
    description?: string | undefined;
    start?: Date | undefined;
    private?: boolean | undefined;
    messagePrice?: number | undefined;
    songSuggestionPrice?: number | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default eventModel;
