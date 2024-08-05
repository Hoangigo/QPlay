import { Request, Response } from "express";
export declare const client_id: string | undefined;
export declare const client_secret: string | undefined;
export declare const requestAndSetNewToken: () => Promise<void>;
export declare const reduceArtistsToName: (artists: any[]) => String[];
export declare const reduceSearch: (searchResult: any[]) => {
    images: any;
    id: any;
    name: any;
    artists: String[];
}[];
export declare const getTrackById: (req: Request, res: Response) => Promise<void>;
export declare const getTracksById: (req: Request, res: Response) => Promise<void>;
export declare const searchForTrack: (req: Request, res: Response) => Promise<void>;
