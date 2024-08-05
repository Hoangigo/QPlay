import express from 'express';
import { createSuggestion, deleteSuggestion, getEventSuggestions, updateSuggestion } from '../controllers/suggestion.controller';

const router = express.Router();

router.get('/:id', (req, res) => getEventSuggestions(req, res));

router.post('/create/:eventId', (req, res) => createSuggestion(req, res));

router.put('/:id', (req, res) => updateSuggestion(req, res));

router.delete('/:id', (req, res) => deleteSuggestion(req, res));

export default router;