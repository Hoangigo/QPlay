"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const suggestion_controller_1 = require("../controllers/suggestion.controller");
const router = express_1.default.Router();
router.get('/:id', (req, res) => (0, suggestion_controller_1.getEventSuggestions)(req, res));
router.post('/create/:eventId', (req, res) => (0, suggestion_controller_1.createSuggestion)(req, res));
router.put('/:id', (req, res) => (0, suggestion_controller_1.updateSuggestion)(req, res));
router.delete('/:id', (req, res) => (0, suggestion_controller_1.deleteSuggestion)(req, res));
exports.default = router;
