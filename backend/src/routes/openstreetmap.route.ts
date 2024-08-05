import express from "express";
import { getAddressData } from "../controllers/openstreetmap.controller";

const router = express.Router();

router.get('/:lat/:lng', (req, res) => getAddressData(req, res));

export default router;