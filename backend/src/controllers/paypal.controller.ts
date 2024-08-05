import { Request, Response } from "express";
import client from "../helper/paypal.helper";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

// authorize paypal payment method
//
export const authorizePayment = async (req: Request, res: Response) => {
    // create request
    let paypalRequest = new paypal.orders.OrdersCreateRequest();
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

    const paypalResponse = await client.execute(paypalRequest).catch(() => {
        return;
    });

    if (!paypalResponse) {
        return res.status(400).json({
            error: "error while creating payment"
        });
    }

    return res.status(201).send(paypalResponse);
}

// capture paypal payment method
//
export const capturePayment = async (req: Request, res: Response) => {
    // get authorized payment
    const token = req.body.token; 
    let paypalRequest =  new paypal.orders.OrdersCaptureRequest(token);

    const paypalResponse = await client.execute(paypalRequest).catch(() => {
        return; // order already captured
    });

    if (!paypalResponse) {
        return res.status(400).json({
            error: "error while creating payment"
        });
    }

    return res.status(200).send(paypalResponse);
}

// paypal payment refund method
//
export const refundPayment = async (req: Request, res: Response) => {
    const paypalRefundRequest = new paypal.payments.CapturesRefundRequest(req.body.refundId);

    paypalRefundRequest.requestBody({
        "amount": {
            "value": req.body.price,
            "currency_code": "EUR",
        },
        "invoice_id": req.body.paymentId,
        "note_to_payer": "Refund from qplay",
    });

    const paypalRefundResponse = await client.execute(paypalRefundRequest).catch(() => {
        return; // order already refunded
    });
    
    if (!paypalRefundResponse) {
        return res.status(400).json({
            error: "error while refunding payment"
        });
    }

    return res.status(200).send(paypalRefundResponse);
}