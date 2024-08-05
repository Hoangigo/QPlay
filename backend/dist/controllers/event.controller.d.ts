import { Request, Response } from "express";
export declare const createNewEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEventInfoData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEventVoteData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEventAuctionData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getEventSuggestionData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
