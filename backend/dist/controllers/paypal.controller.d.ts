import { Request, Response } from "express";
export declare const authorizePayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const capturePayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const refundPayment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
