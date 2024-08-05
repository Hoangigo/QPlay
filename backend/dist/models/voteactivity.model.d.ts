import mongoose from "mongoose";
declare const voteActivityModel: mongoose.Model<{
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
}> & Omit<{
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
}>> & Omit<mongoose.FlatRecord<{
    start: Date;
    voteOptions: mongoose.Types.ObjectId[];
    end?: Date | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default voteActivityModel;
