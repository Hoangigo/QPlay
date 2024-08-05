"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const router = express_1.default.Router();
router.get("/data/info/:id", (req, res) => (0, event_controller_1.getEventInfoData)(req, res));
router.get("/data/vote/:id", (req, res) => (0, event_controller_1.getEventVoteData)(req, res));
router.get("/data/auction/:id", (req, res) => (0, event_controller_1.getEventAuctionData)(req, res));
router.get("/data/suggestion/:id", (req, res) => (0, event_controller_1.getEventSuggestionData)(req, res));
router.post("/create/:email", (req, res) => (0, event_controller_1.createNewEvent)(req, res));
router.put("/:id", (req, res) => (0, event_controller_1.updateEvent)(req, res));
router.delete("/:id", (req, res) => (0, event_controller_1.deleteEvent)(req, res));
exports.default = router;
