import mongoose from "mongoose";
declare const voteOptionModel: mongoose.Model<{
    count: number;
    songId?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    count: number;
    songId?: string | undefined;
}> & Omit<{
    count: number;
    songId?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    count: number;
    songId?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    count: number;
    songId?: string | undefined;
}>> & Omit<mongoose.FlatRecord<{
    count: number;
    songId?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default voteOptionModel;
