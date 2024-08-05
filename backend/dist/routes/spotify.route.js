"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const spotify_controller_1 = require("../controllers/spotify.controller");
const routerSpotify = express_1.default.Router();
routerSpotify.get('/track/:id', (req, res) => (0, spotify_controller_1.getTrackById)(req, res));
routerSpotify.get('/tracks/:id', (req, res) => (0, spotify_controller_1.getTracksById)(req, res));
routerSpotify.get('/search', async (req, res) => (0, spotify_controller_1.searchForTrack)(req, res));
exports.default = routerSpotify;
