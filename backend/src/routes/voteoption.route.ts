import express from 'express';
import { updateOptionCount } from '../controllers/voteoption.controller';

const router = express.Router();

router.put('/update/count', (req, res) => updateOptionCount(req, res));

export default router;