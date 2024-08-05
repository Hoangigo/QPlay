import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { Request } from 'express';
type JWTHostData = {
    email: string;
    _id: ObjectId;
};
export declare const generateToken: (payload: JWTHostData) => string | null;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload | null;
export declare const checkRequestForToken: (req: Request) => boolean;
export {};
