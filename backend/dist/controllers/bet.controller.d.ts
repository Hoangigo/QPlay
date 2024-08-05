import { Request, Response } from "express";
export declare const getEventBets: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createBet: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
