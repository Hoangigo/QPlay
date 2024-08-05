"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRequestForToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_OPTIONS = {
    expiresIn: 86400,
    issuer: 'http://qplay.auth',
};
const BEARER = 'Bearer ';
// generate token and sign it with user data
const generateToken = (payload) => {
    if (process.env.JWT_SECRET_KEY) {
        return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, JWT_OPTIONS);
    }
    else {
        console.log("Unable to create token!!");
        return null;
    }
};
exports.generateToken = generateToken;
// verify the token
const verifyToken = (token) => {
    if (process.env.JWT_SECRET_KEY) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        }
        catch (err) {
            console.log("catch: verifyToken");
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return null;
            }
            return null;
        }
    }
    else {
        console.log("Unable to verify token!!");
        return null;
    }
};
exports.verifyToken = verifyToken;
const checkRequestForToken = (req) => {
    if (!req.headers.authorization?.includes(BEARER)) {
        return false;
    }
    else {
        //validate
        const token = req.headers.authorization.replace(BEARER, '');
        try {
            const verifyResult = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || "");
            if (!verifyResult) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (err) {
            console.log("catch: checkRequestForToken");
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return false;
            }
            return false;
        }
    }
};
exports.checkRequestForToken = checkRequestForToken;
