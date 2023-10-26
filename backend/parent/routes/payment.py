from flask import Blueprint, request, jsonify, Flask, render_template
from flask_cors import CORS
import stripe 
import json
import os



payment = Blueprint('payment', __name__)
CORS(payment)

# This is your test secret API key.
#stripe.api_key = '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'
stripe.api_key = 'sk_test_51NgKGJEU8oOZ4QrtbIHbBhBWj1cBKoq1cubD5kEvyJgHjvtHHIygFdqrrs3EAKdtrCEjDnkB8ONVUfvBnBRdgmG000YaUghMvE'
def calculate_order_amount(items):
    # Initialize the totalAmount
    totalAmount = 0

    # Iterate through the items
    for item in items:
        # Calculate the subtotal for each item
        subtotal = float(item['price']) * int(item['amount']) * 100

        # Add the subtotal to the totalAmount
        totalAmount += subtotal

    # The totalAmount now represents the total order amount in the smallest currency unit
    print(totalAmount)

    return int(totalAmount)



@payment.route('/api/payment/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data['items']),
            currency='sgd',
            # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods={
                'enabled': True,
            },
        )
        print(intent['client_secret'])
        # add_invoice(data['ticketingOrderDetails'])

        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403
    




# if __name__ == '__main__':
#     payment.run(port=4242)