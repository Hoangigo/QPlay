import express from 'express';
import { createVote, deleteVote, getVote } from '../controllers/voteactivity.controller';

const router = express.Router();

router.get('/:id', (req, res) => getVote(req, res));

router.post('/create/:eventId', (req, res) => createVote(req, res));

router.delete('/:id', (req, res) => deleteVote(req, res));

export default router;