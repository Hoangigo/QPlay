"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openstreetmap_controller_1 = require("../controllers/openstreetmap.controller");
const router = express_1.default.Router();
router.get('/:lat/:lng', (req, res) => (0, openstreetmap_controller_1.getAddressData)(req, res));
exports.default = router;
