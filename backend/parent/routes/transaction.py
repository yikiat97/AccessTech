from flask import Blueprint, request, jsonify,Flask,url_for

import random
from sqlalchemy.orm import joinedload
from sqlalchemy import asc


from ..extensions import db
from ..models.transaction import Transactions
from ..models.invoice import Invoice
from ..models.discount import Discount
from ..models.dish import dishes
from ..models.discount_invoice import DiscountInvoice
from ..models.special_comments import special_comments
from ..models.transaction_special_comments import TransactionSpecialComments
from ..extensions import socketio


# app = Flask(__name__)
# socketio = SocketIO(app)


transaction = Blueprint('transaction', __name__)
invoice_details=[]
@transaction.route('/api/admin/add_invoice', methods=['POST'])
def add_invoice():
    try:
        # Extract data from the request
        data = request.json
        date_time = data.get('date_time')
        total_price = data.get('total_price')
        queue_num = data.get('queue_num')
        invoice_status = data.get('invoice_status')
        discount_id = data.get('discount_id')
        transactions_data = data.get('transactions', [])

        # Create a new Invoice instance
        new_invoice = Invoice(
            date_time=date_time,
            total_price=total_price,
            queue_num=queue_num,
            invoice_status=invoice_status,
            color="gray.500"
        )
        db.session.add(new_invoice)
        db.session.flush()  # Flush to get the invoice_id

        # Linking the discount to the invoice without modifying the model
        if discount_id:
            discount = Discount.query.get(discount_id)
            if not discount:
                return jsonify({"error": "Discount not found"}), 404
            
            # Update discount status to completed
            discount.discount_status = "completed"
            
            discount_invoice_entry = DiscountInvoice(discount_id=discount_id, invoice_id=new_invoice.invoice_id)
            db.session.add(discount_invoice_entry)


        # Prepare a list to store response data for each transaction
        transactions_response_data = []

        # Add transactions to the new invoice
        for trans_data in transactions_data:
            special_comments_ids = trans_data.get('special_comments_id', [])

            new_transaction = Transactions(
                dish_id=trans_data.get('dish_id'),
                quantity=trans_data.get('quantity'),
                with_special_comments=bool(special_comments_ids),
                invoice_id=new_invoice.invoice_id  # Link the transaction to the invoice
            )

            db.session.add(new_transaction)
            db.session.flush()  # Flush to get the transaction IDs

            # If there are special comments, add them to the transaction_special_comments table
            for comment_id in special_comments_ids:
                comment_relation = TransactionSpecialComments(
                    special_comments_id=comment_id,
                    dish_id=new_transaction.dish_id,
                    invoice_id=new_transaction.invoice_id
                )
                db.session.add(comment_relation)

            # Fetch the special comments for this transaction
            special_comments_data = []

            for comment_id in special_comments_ids:
                special_comment = special_comments.query.filter_by(special_comments_id=comment_id).first()
                if special_comment:
                    special_comments_data.append({
                        'comment_id': special_comment.special_comments_id,
                        'dish_id': special_comment.dish_id,
                        'text': special_comment.special_comments,
                        'special_comments_price': special_comment.special_comments_price
                    })

            # Fetch the dish name for this transaction
            dish = dishes.query.filter_by(dish_id=new_transaction.dish_id).first()
            dish_name = dish.dish_name if dish else None

            # Prepare the response data for this transaction
            transaction_response_data = {
                'dish_id': new_transaction.dish_id,
                'dish_name': dish_name,  # Include dish name for this transaction
                'quantity': new_transaction.quantity,
                'special_comments': special_comments_data  # Include special comments data for this transaction
            }

            transactions_response_data.append(transaction_response_data)

        # Commit the changes to the database
        db.session.commit()
        print("Emitting update event")

        # Prepare the overall response data
        response_data = {
            "invoice_id": new_invoice.invoice_id,
            "date_time": date_time,
            "total_price": total_price,
            "invoice_status": invoice_status,
            "color": "gray.500",  # Include the color
            "transactions": transactions_response_data,  # Include transactions data with special comments
        }

        # Emit the response data to connected clients using Socket.io
        socketio.emit('update', {'data': response_data})

        # Return a success message along with the ID of the created invoice
        return jsonify({"message": "Invoice, transactions, special comments, and discount status updated successfully!", "invoice_id": new_invoice.invoice_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400




@transaction.route('/api/admin/fetch_invoice_details', methods=['GET'])
def fetch_invoice_details():
    try:
        # Start by fetching all invoices
        invoices = Invoice.query.all()
        
        results = []

        for invoice in invoices:
            invoice_data = {
                "invoice_id": invoice.invoice_id,
                "date_time": invoice.date_time,
                "total_price": invoice.total_price,
                "invoice_status": invoice.invoice_status,
                "transactions": [],
                "discounts": []
            }

            # Fetch transactions related to this invoice
            transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()
            for transaction in transactions:
                transaction_data = {
                    "dish_id": transaction.dish_id,
                    "quantity": transaction.quantity,
                    "with_special_comments": transaction.with_special_comments,
                    "special_comments": []
                }

                if transaction.with_special_comments:
                    # Fetch special comments related to this transaction
                    comments = TransactionSpecialComments.query.filter_by(dish_id=transaction.dish_id, invoice_id=transaction.invoice_id).all()
                    for comment_relation in comments:
                        comment = special_comments.query.get(comment_relation.special_comments_id)
                        if comment:  # Ensure comment exists
                            transaction_data["special_comments"].append({
                                "comment_id": comment.special_comments_id,
                                "text": comment.special_comments
                            })

                invoice_data["transactions"].append(transaction_data)

            # Fetch discount-invoice relationships for this invoice
            discount_invoices = DiscountInvoice.query.filter_by(invoice_id=invoice.invoice_id).all()
            for discount_invoice in discount_invoices:
                discount = Discount.query.get(discount_invoice.discount_id)
                if discount:  # Ensure discount exists
                    invoice_data["discounts"].append({
                        "discount_id": discount.discount_id,
                        "discount_percent": discount.discount_percent
                    })

            results.append(invoice_data)

            print(results)
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400




@transaction.route('/api/admin/fetch_invoice_parameter', methods=['GET'])
def fetch_invoice_parameter():
    try:
        # Get parameters from the request
        invoice_status = request.args.get('invoice_status')
        dish_type = request.args.get('dish_type')

        # Start by fetching invoices based on the invoice_status
        query = Invoice.query

        # If invoice_status is provided, filter by it
        if invoice_status:
            query = query.filter(Invoice.invoice_status == invoice_status)

        invoices = query.order_by(asc(Invoice.invoice_id)).all()  # Sort by invoice_id in ascending order

        results = []

        for invoice in invoices:
            # Fetch transactions related to this invoice
            transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()

            # If dish_type is provided, filter transactions by it
            if dish_type:
                transactions = [t for t in transactions if dishes.query.get(t.dish_id).dish_type == dish_type]

            # If after filtering by dish_type, there are no transactions, skip this invoice
            if not transactions:
                continue

            invoice_data = {
                "invoice_id": invoice.invoice_id,
                "date_time": invoice.date_time,
                "total_price": invoice.total_price,
                "invoice_status": invoice.invoice_status,
                "color": invoice.color,
                "transactions": [],
                "discounts": []
            }

            for transaction in transactions:
                transaction_data = {
                    "dish_id": transaction.dish_id,
                    "quantity": transaction.quantity,
                    "with_special_comments": transaction.with_special_comments,
                    "special_comments": []
                }

                # Fetch the dish using the dish_id from the transaction
                dish = dishes.query.get(transaction.dish_id)
                if dish:
                    # Add the dish name to the transaction_data
                    transaction_data["dish_name"] = dish.dish_name

                if transaction.with_special_comments:
                    comments = TransactionSpecialComments.query.filter_by(dish_id=transaction.dish_id, invoice_id=transaction.invoice_id).all()
                    print(comments)
                    for comment_relation in comments:
                        comment = special_comments.query.get(comment_relation.special_comments_id)
                        if comment:
                            transaction_data["special_comments"].append({
                                "comment_id": comment.special_comments_id,
                                "text": comment.special_comments
                            })

                invoice_data["transactions"].append(transaction_data)

            # Fetch discount-invoice relationships for this invoice
            discount_invoices = DiscountInvoice.query.filter_by(invoice_id=invoice.invoice_id).all()
            for discount_invoice in discount_invoices:
                discount = Discount.query.get(discount_invoice.discount_id)
                if discount:
                    invoice_data["discounts"].append({
                        "discount_id": discount.discount_id,
                        "discount_percent": discount.discount_percent
                    })

            results.append(invoice_data)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400



@transaction.route('/api/admin/fetch_fried_transactions', methods=['GET'])
def fetch_fried_transactions():
    try:
        # Get parameters from the request
        invoice_status = request.args.get('invoice_status')
        dish_type = request.args.get('dish_type')

        # Start by fetching invoices based on the invoice_status
        query = Invoice.query

        # If invoice_status is provided, filter by it
        if invoice_status:
            query = query.filter(Invoice.invoice_status == invoice_status)

        invoices = query.order_by(asc(Invoice.invoice_id)).all()  # Sort by invoice_id in ascending order

        results = []

        for invoice in invoices:
            # Fetch transactions related to this invoice
            # Filter transactions using has_fried_dish function
            if has_fried_dish(invoice.invoice_id):
                invoice_data = {
                    "invoice_id": invoice.invoice_id,
                    "date_time": invoice.date_time,
                    "total_price": invoice.total_price,
                    "invoice_status": invoice.invoice_status,
                    "color": invoice.color,
                    "transactions": [],
                    "discounts": []
                }

                transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()

                for transaction in transactions:
                    transaction_data = {
                        "dish_id": transaction.dish_id,
                        "quantity": transaction.quantity,
                        "with_special_comments": transaction.with_special_comments,
                        "special_comments": []
                    }

                    # Fetch the dish using the dish_id from the transaction
                    dish = dishes.query.get(transaction.dish_id)
                    if dish:
                        transaction_data["dish_name"] = dish.dish_name

                    if transaction.with_special_comments:
                        comments = TransactionSpecialComments.query.filter_by(dish_id=transaction.dish_id, invoice_id=transaction.invoice_id).all()
                        for comment_relation in comments:
                            comment = special_comments.query.get(comment_relation.special_comments_id)
                            if comment:
                                transaction_data["special_comments"].append({
                                    "comment_id": comment.special_comments_id,
                                    "text": comment.special_comments
                                })

                    invoice_data["transactions"].append(transaction_data)

                # Fetch discount-invoice relationships for this invoice
                discount_invoices = DiscountInvoice.query.filter_by(invoice_id=invoice.invoice_id).all()
                for discount_invoice in discount_invoices:
                    discount = Discount.query.get(discount_invoice.discount_id)
                    if discount:
                        invoice_data["discounts"].append({
                            "discount_id": discount.discount_id,
                            "discount_percent": discount.discount_percent
                        })

                results.append(invoice_data)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def is_fried_dish(dish_id):
    # Function to check if a dish with the given dish_id is 'fried'
    dish = dishes.query.get(dish_id)
    return dish and 'fried' in dish.dish_name.lower()


def has_fried_dish(invoice_id):
    # Fetch all the transactions for the given invoice_id
    transactions = Transactions.query.filter_by(invoice_id=invoice_id).all()

    # Check if at least one of the transactions has a 'fried' dish
    for transaction in transactions:
        if is_fried_dish(transaction.dish_id):
            return True
    
    return False






@transaction.route('/api/admin/get_invoice/<int:invoice_id>', methods=['GET'])
def get_invoice_by_id(invoice_id):
    try:
        # Fetch the invoice based on the provided invoice_id
        invoice = Invoice.query.get(invoice_id)

        if invoice is None:
            return jsonify({"error": "Invoice not found"}), 404

        # Fetch transactions related to this invoice
        transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()

        invoice_data = {
            "invoice_id": invoice.invoice_id,
            "date_time": invoice.date_time,
            "total_price": invoice.total_price,
            "invoice_status": invoice.invoice_status,
            "transactions": [],
            "discounts": []
        }

        for transaction in transactions:
            transaction_data = {
                "dish_id": transaction.dish_id,
                "quantity": transaction.quantity,
                "with_special_comments": transaction.with_special_comments,
                "special_comments": []
            }

            # Fetch the dish using the dish_id from the transaction
            dish = dishes.query.get(transaction.dish_id)
            if dish:
                # Add the dish name to the transaction_data
                transaction_data["dish_name"] = dish.dish_name

            if transaction.with_special_comments:
                comments = TransactionSpecialComments.query.filter_by(
                    dish_id=transaction.dish_id,
                    invoice_id=transaction.invoice_id
                ).all()
                for comment_relation in comments:
                    comment = special_comments.query.get(comment_relation.special_comments_id)
                    if comment:
                        transaction_data["special_comments"].append({
                            "comment_id": comment.special_comments_id,
                            "text": comment.special_comments
                        })

            invoice_data["transactions"].append(transaction_data)

        # Fetch discount-invoice relationships for this invoice
        discount_invoices = DiscountInvoice.query.filter_by(invoice_id=invoice.invoice_id).all()
        for discount_invoice in discount_invoices:
            discount = Discount.query.get(discount_invoice.discount_id)
            if discount:
                invoice_data["discounts"].append({
                    "discount_id": discount.discount_id,
                    "discount_percent": discount.discount_percent
                })

        return jsonify(invoice_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@transaction.route('/api/ticketing/update_invoice_status_completed/<int:invoice_id>', methods=['PUT'])
def update_invoice_status_completed(invoice_id):
    try:
        # Fetch the specific invoice using the provided invoice_id
        invoice = Invoice.query.get(invoice_id)
        
        # Check if the invoice exists
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        
        # Update the invoice_status
        invoice.invoice_status = "completed"
        
        # Commit the changes
        db.session.commit()
        socketio.emit('completeOrder')

        return jsonify({"message": "Invoice status completed successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
    

@transaction.route('/api/ticketing/update_invoice_status_cancel/<int:invoice_id>', methods=['PUT'])
def update_invoice_status_cancel(invoice_id):
    try:
        # Fetch the specific invoice using the provided invoice_id
        invoice = Invoice.query.get(invoice_id)
        
        # Check if the invoice exists
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        
        # Update the invoice_status
        invoice.invoice_status = "cancelled"
        
        # Commit the changes
        db.session.commit()
        socketio.emit('cancelOrder')

        return jsonify({"message": "Invoice status cancelled successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@transaction.route('/api/ticketing/update_invoice_colors/<int:invoice_id>', methods=['POST'])
def update_invoice_colors(invoice_id):
    try:
        # Fetch the specific invoice using the provided invoice_id
        invoice = Invoice.query.get(invoice_id)
        # Update the invoice_status
        print(invoice)
        request_data = request.get_json()
        print(request_data)
        # Extract the 'color' value from the request data
        color = request_data.get('color')    
        invoice.color=str(color)
        # Commit the changes
        db.session.commit()
        # Check if the invoice exists
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        socketio.emit('updateColor')


        return jsonify({"message": "Invoice "+str(invoice_id)+" assigned color successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
