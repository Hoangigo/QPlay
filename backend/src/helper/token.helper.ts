import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import { Response, Request, Router } from 'express';

dotenv.config();

type JWTHostData = {
    email: string;
    _id: ObjectId;
};

const JWT_OPTIONS: SignOptions = {
    expiresIn: 86400, // in seconds (24h)
    issuer: 'http://qplay.auth',
};

const BEARER = 'Bearer ';

// generate token and sign it with user data
export const generateToken = (payload: JWTHostData) => {
    if (process.env.JWT_SECRET_KEY) {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, JWT_OPTIONS);
    } else {
        console.log("Unable to create token!!");
        return null;
    }
};

// verify the token
export const verifyToken = (token: string) => {
    if (process.env.JWT_SECRET_KEY) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET_KEY);    
        } catch (err) {
            console.log("catch: verifyToken");
            if (err instanceof jwt.TokenExpiredError) {
                return null;
            }
            return null;
        }
    } else {
        console.log("Unable to verify token!!");
        return null;
    }
};

export const checkRequestForToken = (req: Request) => {
    if (!req.headers.authorization?.includes(BEARER)) {
        return false;
    } else {
        //validate
        const token = req.headers.authorization.replace(BEARER, '');
        try {
            const verifyResult = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
            if (!verifyResult) {
                return false;
            } else {
                return true;
            }
        } catch (err) {
            console.log("catch: checkRequestForToken");
            if (err instanceof jwt.TokenExpiredError) {
                return false;
            }
            return false;
        }
    }
};