import express from 'express';
import { verifyJWTToken } from '../controllers/auth.controller';

const router = express.Router();

router.post('/verify/token', (req, res) => verifyJWTToken(req, res));

export default router;