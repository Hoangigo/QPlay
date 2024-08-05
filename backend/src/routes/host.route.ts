import express from "express";
import { createNewHost, getExistingHost, verifyEmailConfirmation, resetHostPassword, resetRequestHostPassword, confirmResetPasswordToken, getHostByEmail, deleteHost, updateHost, changeHostPassword } from "../controllers/host.controller";

const router = express.Router();

router.get("/confirm/:id", (req, res) => verifyEmailConfirmation(req, res));

router.get("/:email", (req, res) => getHostByEmail(req, res));

router.post("/", (req, res) => createNewHost(req, res));

router.post("/password/reset-request", (req, res) => resetRequestHostPassword(req, res));

router.post("/password/reset", (req, res) => resetHostPassword(req, res));

router.post("/password/reset/confirm-token", (req, res) => confirmResetPasswordToken(req, res));

router.post("/login", (req, res) => getExistingHost(req, res));

router.post("/change/password/:email", (req, res) => changeHostPassword(req, res));

router.delete("/:email", (req, res) => deleteHost(req, res));

router.put("/:email", (req, res) => updateHost(req, res));

export default router;
