import mongoose from "mongoose";
declare const betModel: mongoose.Model<{
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
}> & Omit<{
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
}>> & Omit<mongoose.FlatRecord<{
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default betModel;
