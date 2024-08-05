"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_id = process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID : "";
const client_secret = process.env.PAYPAL_CLIENT_SECRET ? process.env.PAYPAL_CLIENT_SECRET : "";
const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(client_id, client_secret);
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
exports.default = client;
