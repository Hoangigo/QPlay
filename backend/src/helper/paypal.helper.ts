import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const client_id = process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID : "";
const client_secret = process.env.PAYPAL_CLIENT_SECRET ? process.env.PAYPAL_CLIENT_SECRET : "";

 
const environment = new paypal.core.SandboxEnvironment(client_id, client_secret);
const client = new paypal.core.PayPalHttpClient(environment);

export default client;