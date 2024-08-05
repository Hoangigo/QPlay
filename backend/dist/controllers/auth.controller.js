"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWTToken = void 0;
const token_helper_1 = require("../helper/token.helper");
// verify jwt token method
//
const verifyJWTToken = (req, res) => {
    const token = req.body.jwt_token;
    const verifyResult = (0, token_helper_1.verifyToken)(token);
    if (!verifyResult) {
        return res.status(400).send(false);
    }
    return res.status(200).send(true);
};
exports.verifyJWTToken = verifyJWTToken;
