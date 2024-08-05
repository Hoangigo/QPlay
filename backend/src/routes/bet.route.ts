import express from "express";
import { createBet, getEventBets } from "../controllers/bet.controller";

const router = express.Router();

router.get("/:auctionId", (req, res) => getEventBets(req, res));

router.post("/create/:auctionId", (req, res) => createBet(req, res));

export default router;
