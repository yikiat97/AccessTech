import React, { useEffect, useState, useContext } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements,
    // ExpressCheckoutElement
} from "@stripe/react-stripe-js";
import CartContext from '../../Components/ordering/Cart/cart-context';
import { Button, Spinner, FormControl, FormLabel, Input, Box, Flex } from "@chakra-ui/react";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const cartCtx = useContext(CartContext);

    useEffect(() => {
        if (!stripe) {
        return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
        );

        if (!clientSecret) {
        return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent.status) {
            case "succeeded":
            setMessage("Payment succeeded!");
            break;
            case "processing":
            setMessage("Your payment is processing.");
            break;
            case "requires_payment_method":
            setMessage("Your payment was not successful, please try again.");
            break;
            default:
            setMessage("Something went wrong.");
            break;
        }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            
            // Make sure to change this to your payment completion page
           // return_url: "https://d1yoopjwqn3bey.cloudfront.net/AccessTech/customerorder",
            //return_url: "http://localhost:3000/AccessTech/customerorder",
            return_url: "https://development.d26dx5d6t48iwd.amplifyapp.com/AccessTech/customerorder",
            
            ...(email ? { receipt_email: email } : {}), //only workable in deployment and not in test
        },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
        } else {
        setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        business: {
            name: "Kunyah Cafe",
        },
        layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true
        }
    };
    

    return (
        <div className="stripe-checkout-container">
            <form id="payment-form" className="payment-form" onSubmit={handleSubmit}>
            {/* <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.target.value)}
            /> */}
            {/* <ExpressCheckoutElement onConfirm={handleSubmit}/> */}
            {/* <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit" style={{ backgroundColor: '#007BFF' }}>
                <span id="button-text" >
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button> */}
            <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            // required
            />
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="payment-button"
                style={{
                    backgroundColor: 'rgb(0, 123, 255)', // Set the background color to Bootstrap's primary color (blue)
                    borderRadius: '10px', // Add a border radius for curved corners
                    color: 'white', // Set text color to white
                    padding: '7px 17px', // Adjust the padding to increase the button size
                    fontSize: '18px', // Adjust the font size to make the text larger
                }}
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
        
    );
}