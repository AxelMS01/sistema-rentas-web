import Stripe from "stripe";

export const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
    typescript: false,
});
