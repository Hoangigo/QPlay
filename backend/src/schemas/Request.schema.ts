import { object, string, number } from 'yup';

export const SearchTrackSchema = object({
    q: string().required(),
    limit: number().required()
});