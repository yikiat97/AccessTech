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
const stripePromise = loadStripe("pk_test_51NgKGJEU8oOZ4Qrt3cn1PGRdEJZ5TlsQfkCGHaZ0sxvPEqkv3zANneT6u4ONqniSu0UqpjR5kp6kWrpuCPMgxByS00Zt7YI0Fm");

export default function Payment() {
    const [clientSecret, setClientSecret] = useState("");
    const cartCtx = useContext(CartContext);
    console.log(cartCtx)
    useEffect(() => {
        if (cartCtx && cartCtx.items.length > 0) { 
            const ticketingOrderDetails = {
            "date_time": "2023-09-02T14:30:00Z",
            "total_price": cartCtx.totalAmount,
            "queue_num": 0,
            "invoice_status": "pending",
            "discount_id": 0,
            "transactions": cartCtx.items.map(item => {
                return {
                "dish_id": item.dish_id,
                "quantity": item.amount,
                "special_comments_id": item.specialInstructions.map(special => special.special_comments_id)
                };
            })
        };
        console.log(ticketingOrderDetails)
        // Create PaymentIntent as soon as the page loads
        // console.log(cartCtx.items)
        fetch("http://127.0.0.1:5000/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartCtx.items , ticketingOrderDetails:ticketingOrderDetails}),
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
