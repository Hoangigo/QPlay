"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const voteactivity_controller_1 = require("../controllers/voteactivity.controller");
const router = express_1.default.Router();
router.get('/:id', (req, res) => (0, voteactivity_controller_1.getVote)(req, res));
router.post('/create/:eventId', (req, res) => (0, voteactivity_controller_1.createVote)(req, res));
router.delete('/:id', (req, res) => (0, voteactivity_controller_1.deleteVote)(req, res));
exports.default = router;
