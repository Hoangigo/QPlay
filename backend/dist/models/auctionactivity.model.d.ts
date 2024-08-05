import mongoose from "mongoose";
declare const auctionActivityModel: mongoose.Model<{
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
}> & Omit<{
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
}>> & Omit<mongoose.FlatRecord<{
    start: Date;
    bets: mongoose.Types.ObjectId[];
    end?: Date | undefined;
    startPrice?: number | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default auctionActivityModel;
