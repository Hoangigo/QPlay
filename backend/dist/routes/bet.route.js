"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bet_controller_1 = require("../controllers/bet.controller");
const router = express_1.default.Router();
router.get("/:auctionId", (req, res) => (0, bet_controller_1.getEventBets)(req, res));
router.post("/create/:auctionId", (req, res) => (0, bet_controller_1.createBet)(req, res));
exports.default = router;
