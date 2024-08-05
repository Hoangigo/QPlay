import express from "express";
import { createNewEvent, deleteEvent, getEventAuctionData, getEventInfoData, getEventSuggestionData, getEventVoteData, updateEvent } from "../controllers/event.controller";

const router = express.Router();

router.get("/data/info/:id", (req, res) => getEventInfoData(req, res));

router.get("/data/vote/:id", (req, res) => getEventVoteData(req, res));

router.get("/data/auction/:id", (req, res) => getEventAuctionData(req, res));

router.get("/data/suggestion/:id", (req, res) => getEventSuggestionData(req, res));

router.post("/create/:email", (req, res) => createNewEvent(req, res));

router.put("/:id", (req, res) => updateEvent(req, res));

router.delete("/:id", (req, res) => deleteEvent(req, res));

export default router;
