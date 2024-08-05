import { Request, Response } from "express";
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import { SearchTrackSchema } from "../schemas/Request.schema";

dotenv.config();

export const client_id = process.env.SPOTIFY_CLIEND_ID;
export const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

//Response interceptor for API calls
axios.interceptors.response.use((response) => {
    return response
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) { //if key is not valid 
        originalRequest._retry = true;
        await requestAndSetNewToken();
        return axios(originalRequest);
    }
    return Promise.reject(error);
});

// request and set new auth token method
//
export const requestAndSetNewToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', client_id || '');
    params.append('client_secret', client_secret || '');
      
    await axios.post("https://accounts.spotify.com/api/token", params).then((response: AxiosResponse) => {
        if (response.data.access_token){
            axios.defaults.headers.common = { 'Authorization': `Bearer ${response.data.access_token}` }
        }
    }).catch((error) => {
        console.log(error);
    }); 
}

// reduce artists name method
//
export const reduceArtistsToName = (artists: any[]) => {
    let names: String[] = [];

    try {
        artists.forEach(artist => {
            names.push(artist.name)
        });
        return names;
    } catch (error) {
        console.log(error);
        return names;
    }
}

// reduce search method
//
export const reduceSearch = (searchResult:any[]) => {
    let filteredSearch: {
        images: any;
        id: any;
        name: any;
        artists: String[];
    }[] = [];

    try {
        searchResult.forEach(item => {
            let newItem = {
                'images': item.album.images,
                'id': item.id,
                'name': item.name,
                'artists': reduceArtistsToName(item.artists)
            };
            filteredSearch.push(newItem);
        })
        return filteredSearch;
    } catch (error) {
        console.log(error);
        return filteredSearch;
    }
}

const generateResponseFromTracks = (searchResult:any[]) => {
    let returnData: {
        images: any;
        id: any;
        name: any;
        artists: String[];
    }[] = []
    try {
        searchResult.forEach(item => {
            if (item.album.images) {
                let newItem = {
                    'images': item.album.images,
                    'id': item.id,
                    'name': item.name,
                    'artists': reduceArtistsToName(item.artists)
                };
                returnData.push(newItem);
            }
        })
        return returnData;
    } catch (error) {
        console.log(error);
        return returnData;
    }
}

// get track by id method
//
export const getTrackById = async (req: Request, res: Response) => {
    await axios.get("https://api.spotify.com/v1/tracks/" + req.params.id).then((response: AxiosResponse) => {
        if (response.status === 200) {
            if (response.data.album.images) {
                let returnData = {
                    'images': response.data.album.images,
                    'id': response.data.id,
                    'name': response.data.name,
                    'artists': reduceArtistsToName(response.data.artists)
                }
                res.status(response.status).send(returnData);
            } else {
                res.status(response.status).send({});
            }
        } else if (response.status === 429) {
            res.status(response.status).send({});
        } else {
            res.status(response.status).send(response.data);
        }
    })
        .catch((error) => {
            console.log(error);
            return res.status(400).send({ errors: [error.message] });
        });
}

export const getTracksById = async (req: Request, res: Response) => {
    await axios.get("https://api.spotify.com/v1/tracks?market=DE&ids=" + req.params.id).then(response => {
        if (response.status === 200) {
            const reducedData = generateResponseFromTracks(response.data.tracks);
            res.status(response.status).send(reducedData);
        } else if (response.status === 429) {
            res.status(response.status).send({});
        } else {
            res.status(response.status).send(response.data);
        }
    }).catch((error) => {
            console.log(error);
            return res.status(400).send({ errors: [error.message] });
        });
}

// search for track method
//
export const searchForTrack = async (req: Request, res: Response) => {
    const validatedData = await SearchTrackSchema.validate(req.query).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }

    await axios.get("https://api.spotify.com/v1/search", {
        params: {
            market: "DE",
            q: validatedData.q,
            limit: validatedData.limit,
            type: "track"
        }
    }).then((response: AxiosResponse) => {
        if (response.status === 200) {
            const reducedData = reduceSearch(response.data.tracks.items);
            res.status(response.status).send(reducedData);
        } else if (response.status === 429) {
            res.status(response.status).send({});
        } else {
            res.status(response.status).send(response.data);
        }
    }).catch((error) => {
            console.log(error);
            return res.status(400).send({ errors: [error.message] });
        });
}