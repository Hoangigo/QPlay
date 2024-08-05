"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auctionactivity_controller_1 = require("../controllers/auctionactivity.controller");
const router = express_1.default.Router();
router.post("/create/:eventId", (req, res) => (0, auctionactivity_controller_1.createAuction)(req, res));
router.delete("/:id", (req, res) => (0, auctionactivity_controller_1.deleteAuction)(req, res));
exports.default = router;
