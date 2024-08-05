"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const host_controller_1 = require("../controllers/host.controller");
const router = express_1.default.Router();
router.get("/confirm/:id", (req, res) => (0, host_controller_1.verifyEmailConfirmation)(req, res));
router.get("/:email", (req, res) => (0, host_controller_1.getHostByEmail)(req, res));
router.post("/", (req, res) => (0, host_controller_1.createNewHost)(req, res));
router.post("/password/reset-request", (req, res) => (0, host_controller_1.resetRequestHostPassword)(req, res));
router.post("/password/reset", (req, res) => (0, host_controller_1.resetHostPassword)(req, res));
router.post("/password/reset/confirm-token", (req, res) => (0, host_controller_1.confirmResetPasswordToken)(req, res));
router.post("/login", (req, res) => (0, host_controller_1.getExistingHost)(req, res));
router.post("/change/password/:email", (req, res) => (0, host_controller_1.changeHostPassword)(req, res));
router.delete("/:email", (req, res) => (0, host_controller_1.deleteHost)(req, res));
router.put("/:email", (req, res) => (0, host_controller_1.updateHost)(req, res));
exports.default = router;
