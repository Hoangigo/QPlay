import mongoose from "mongoose";
declare const hostModel: mongoose.Model<{
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
}> & Omit<{
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
} & {
    _id: mongoose.Types.ObjectId;
}, never>, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
}>> & Omit<mongoose.FlatRecord<{
    email: string;
    password: string;
    isConfirmed: boolean;
    events: mongoose.Types.ObjectId[];
    name?: string | undefined;
    resetPasswordToken?: any;
    resetPasswordExpires?: any;
}> & {
    _id: mongoose.Types.ObjectId;
}, never>>>;
export default hostModel;
