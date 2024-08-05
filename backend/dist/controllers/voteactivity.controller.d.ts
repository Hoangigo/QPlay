import { Request, Response } from "express";
export declare const getVote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createVote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteVote: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
