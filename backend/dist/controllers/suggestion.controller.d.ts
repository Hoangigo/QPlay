import { Request, Response } from "express";
export declare const getEventSuggestions: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateSuggestion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
