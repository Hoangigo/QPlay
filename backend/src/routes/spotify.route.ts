import express from 'express';
import { getTrackById, getTracksById, searchForTrack } from '../controllers/spotify.controller';

const routerSpotify = express.Router();

routerSpotify.get('/track/:id', (req, res) => getTrackById(req, res));

routerSpotify.get('/tracks/:id', (req, res) => getTracksById(req, res));

routerSpotify.get('/search', async (req, res) => searchForTrack(req, res));

export default routerSpotify;