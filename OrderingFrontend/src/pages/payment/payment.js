import { Box, AbsoluteCenter, Divider, SimpleGrid, Card } from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CartContext from '../../Components/ordering/Cart/cart-context';

import CheckoutForm from "./checkout";
import "./payment.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_live_51NgKGJEU8oOZ4QrtGRRe1gzzSjZn6YzqQmpfMTqBkj7qXomgP17DCpxdnqRKfe4UrfDdlLXseUJWVcXg9Z9z8sj100AGJOb1o0");

export default function Payment() {
    const [clientSecret, setClientSecret] = useState("");
    const cartCtx = useContext(CartContext);

    useEffect(() => {
        if (cartCtx && cartCtx.items.length > 0) {
        // Create PaymentIntent as soon as the page loads
        // console.log(cartCtx.items)
        fetch(process.env.REACT_APP_API_URL+"/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartCtx.items }),
        })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
    }, [cartCtx]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorText: '#000000',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="App">
        {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
            </Elements>
        )}
        </div>
    );
}
