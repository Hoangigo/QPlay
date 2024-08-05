import { Request, Response } from "express";
import { verifyToken } from "../helper/token.helper";

// verify jwt token method
//
export const verifyJWTToken = (req: Request, res: Response) => {
    const token = req.body.jwt_token;
    const verifyResult = verifyToken(token);

    if (!verifyResult) {
        return res.status(400).send(false);
    }

    return res.status(200).send(true);
}