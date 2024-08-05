import { Request, Response } from "express";
import VoteOption from "../models/voteoption.model";

// update voteoption count method
//
export const updateOptionCount = async (req: Request, res: Response) => {
    const voteOption = await VoteOption.findOneAndUpdate(
        { _id: req.body._id },
        { $inc: { count: 1 } },
        { new: true }
    ).catch((err: any) => {
        return res.status(400).json({
            error: err
        });
    });

    return res.status(200).send(voteOption);
}
