import { Request, Response } from "express";
export declare const createAuction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAuction: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
