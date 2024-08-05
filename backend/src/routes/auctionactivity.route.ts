import express from "express";
import { createAuction, deleteAuction } from "../controllers/auctionactivity.controller";

const router = express.Router();

router.post("/create/:eventId", (req, res) => createAuction(req, res));

router.delete("/:id", (req, res) => deleteAuction(req, res));

export default router;
