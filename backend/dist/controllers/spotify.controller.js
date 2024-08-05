"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForTrack = exports.getTracksById = exports.getTrackById = exports.reduceSearch = exports.reduceArtistsToName = exports.requestAndSetNewToken = exports.client_secret = exports.client_id = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const Request_schema_1 = require("../schemas/Request.schema");
dotenv_1.default.config();
exports.client_id = process.env.SPOTIFY_CLIEND_ID;
exports.client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//Response interceptor for API calls
axios_1.default.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) { //if key is not valid 
        originalRequest._retry = true;
        await (0, exports.requestAndSetNewToken)();
        return (0, axios_1.default)(originalRequest);
    }
    return Promise.reject(error);
});
// request and set new auth token method
//
const requestAndSetNewToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', exports.client_id || '');
    params.append('client_secret', exports.client_secret || '');
    await axios_1.default.post("https://accounts.spotify.com/api/token", params).then((response) => {
        if (response.data.access_token) {
            axios_1.default.defaults.headers.common = { 'Authorization': `Bearer ${response.data.access_token}` };
        }
    }).catch((error) => {
        console.log(error);
    });
};
exports.requestAndSetNewToken = requestAndSetNewToken;
// reduce artists name method
//
const reduceArtistsToName = (artists) => {
    let names = [];
    try {
        artists.forEach(artist => {
            names.push(artist.name);
        });
        return names;
    }
    catch (error) {
        console.log(error);
        return names;
    }
};
exports.reduceArtistsToName = reduceArtistsToName;
// reduce search method
//
const reduceSearch = (searchResult) => {
    let filteredSearch = [];
    try {
        searchResult.forEach(item => {
            let newItem = {
                'images': item.album.images,
                'id': item.id,
                'name': item.name,
                'artists': (0, exports.reduceArtistsToName)(item.artists)
            };
            filteredSearch.push(newItem);
        });
        return filteredSearch;
    }
    catch (error) {
        console.log(error);
        return filteredSearch;
    }
};
exports.reduceSearch = reduceSearch;
const generateResponseFromTracks = (searchResult) => {
    let returnData = [];
    try {
        searchResult.forEach(item => {
            if (item.album.images) {
                let newItem = {
                    'images': item.album.images,
                    'id': item.id,
                    'name': item.name,
                    'artists': (0, exports.reduceArtistsToName)(item.artists)
                };
                returnData.push(newItem);
            }
        });
        return returnData;
    }
    catch (error) {
        console.log(error);
        return returnData;
    }
};
// get track by id method
//
const getTrackById = async (req, res) => {
    await axios_1.default.get("https://api.spotify.com/v1/tracks/" + req.params.id).then((response) => {
        if (response.status === 200) {
            if (response.data.album.images) {
                let returnData = {
                    'images': response.data.album.images,
                    'id': response.data.id,
                    'name': response.data.name,
                    'artists': (0, exports.reduceArtistsToName)(response.data.artists)
                };
                res.status(response.status).send(returnData);
            }
            else {
                res.status(response.status).send({});
            }
        }
        else if (response.status === 429) {
            res.status(response.status).send({});
        }
        else {
            res.status(response.status).send(response.data);
        }
    })
        .catch((error) => {
        console.log(error);
        return res.status(400).send({ errors: [error.message] });
    });
};
exports.getTrackById = getTrackById;
const getTracksById = async (req, res) => {
    await axios_1.default.get("https://api.spotify.com/v1/tracks?market=DE&ids=" + req.params.id).then(response => {
        if (response.status === 200) {
            const reducedData = generateResponseFromTracks(response.data.tracks);
            res.status(response.status).send(reducedData);
        }
        else if (response.status === 429) {
            res.status(response.status).send({});
        }
        else {
            res.status(response.status).send(response.data);
        }
    }).catch((error) => {
        console.log(error);
        return res.status(400).send({ errors: [error.message] });
    });
};
exports.getTracksById = getTracksById;
// search for track method
//
const searchForTrack = async (req, res) => {
    const validatedData = await Request_schema_1.SearchTrackSchema.validate(req.query).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }
    await axios_1.default.get("https://api.spotify.com/v1/search", {
        params: {
            market: "DE",
            q: validatedData.q,
            limit: validatedData.limit,
            type: "track"
        }
    }).then((response) => {
        if (response.status === 200) {
            const reducedData = (0, exports.reduceSearch)(response.data.tracks.items);
            res.status(response.status).send(reducedData);
        }
        else if (response.status === 429) {
            res.status(response.status).send({});
        }
        else {
            res.status(response.status).send(response.data);
        }
    }).catch((error) => {
        console.log(error);
        return res.status(400).send({ errors: [error.message] });
    });
};
exports.searchForTrack = searchForTrack;
