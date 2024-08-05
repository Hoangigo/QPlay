import express from "express";
import { authorizePayment, capturePayment, refundPayment } from "../controllers/paypal.controller";

const router = express.Router();

router.post("/authorize", (req, res) => authorizePayment(req, res));

router.post("/capture", (req, res) => capturePayment(req, res));

router.post("/refund", (req, res) => refundPayment(req, res));

export default router;
