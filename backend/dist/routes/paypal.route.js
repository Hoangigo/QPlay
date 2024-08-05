"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paypal_controller_1 = require("../controllers/paypal.controller");
const router = express_1.default.Router();
router.post("/authorize", (req, res) => (0, paypal_controller_1.authorizePayment)(req, res));
router.post("/capture", (req, res) => (0, paypal_controller_1.capturePayment)(req, res));
router.post("/refund", (req, res) => (0, paypal_controller_1.refundPayment)(req, res));
exports.default = router;
