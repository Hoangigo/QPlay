"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPayment = exports.capturePayment = exports.authorizePayment = void 0;
const paypal_helper_1 = __importDefault(require("../helper/paypal.helper"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// authorize paypal payment method
//
const authorizePayment = async (req, res) => {
    // create request
    let paypalRequest = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
    paypalRequest.requestBody({
        "application_context": {
            "return_url": req.body.returnUrl,
            "cancel_url": req.body.cancelUrl,
        },
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "EUR",
                    "value": req.body.price,
                },
                "description": "Payment for qplay"
            },
        ],
    });
    const paypalResponse = await paypal_helper_1.default.execute(paypalRequest).catch(() => {
        return;
    });
    if (!paypalResponse) {
        return res.status(400).json({
            error: "error while creating payment"
        });
    }
    return res.status(201).send(paypalResponse);
};
exports.authorizePayment = authorizePayment;
// capture paypal payment method
//
const capturePayment = async (req, res) => {
    // get authorized payment
    const token = req.body.token;
    let paypalRequest = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(token);
    const paypalResponse = await paypal_helper_1.default.execute(paypalRequest).catch(() => {
        return; // order already captured
    });
    if (!paypalResponse) {
        return res.status(400).json({
            error: "error while creating payment"
        });
    }
    return res.status(200).send(paypalResponse);
};
exports.capturePayment = capturePayment;
// paypal payment refund method
//
const refundPayment = async (req, res) => {
    const paypalRefundRequest = new checkout_server_sdk_1.default.payments.CapturesRefundRequest(req.body.refundId);
    paypalRefundRequest.requestBody({
        "amount": {
            "value": req.body.price,
            "currency_code": "EUR",
        },
        "invoice_id": req.body.paymentId,
        "note_to_payer": "Refund from qplay",
    });
    const paypalRefundResponse = await paypal_helper_1.default.execute(paypalRefundRequest).catch(() => {
        return; // order already refunded
    });
    if (!paypalRefundResponse) {
        return res.status(400).json({
            error: "error while refunding payment"
        });
    }
    return res.status(200).send(paypalRefundResponse);
};
exports.refundPayment = refundPayment;
