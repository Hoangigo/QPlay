import mongoose from "mongoose";
declare const suggestionModel: mongoose.Model<{
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
}> & Omit<{
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
}>> & Omit<mongoose.FlatRecord<{
    suggestedAt: Date;
    boosted: boolean;
    refunded: boolean;
    message?: string | undefined;
    songId?: string | undefined;
    price?: number | undefined;
    paymentId?: string | undefined;
    accepted?: boolean | undefined;
    refundId?: string | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default suggestionModel;
