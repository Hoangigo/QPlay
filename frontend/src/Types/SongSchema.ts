export type SongImageSchema = {
    height: number;
    url: string;
    width: number;
}

export type SongSchema = {
    id: string;
    name: string;
    artists: string[];
    images: SongImageSchema[];
}

export const mergeArtists = (artists: string[]): string => {
    return artists.reduce((acc, artist, index) => {
        if (index === 0) {
            return artist;
        } else if (index === artists.length - 1) {
            return `${acc} & ${artist}`;
        } else {
            return `${acc}, ${artist}`;
        }
    }, "");
};