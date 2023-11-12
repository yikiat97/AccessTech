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
from ..models.order_number_store import OrderNumberStore
from ..services.admin.inventoryManagement import deductIngredients
from ..extensions import socketio


# app = Flask(__name__)
# socketio = SocketIO(app)
colors = ['#FFC107', '#F44336', '#4CAF50', '#2196F3']
available_colors = set(colors)
unavailable_colors = set()

listOfOrderID={}

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
        # Check if there are any available colors
        if available_colors:
            # Pop a color from the available colors set
            color = available_colors.pop()
            # Add the color to the unavailable colors set
            unavailable_colors.add(color)
        else:
            # If there are no available colors, assign a default color
            color = "gray.500"
            
        # Create a new Invoice instance
        new_invoice = Invoice(
            date_time=date_time,
            total_price=total_price,
            queue_num=queue_num,
            invoice_status=invoice_status,
            color=color
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

            # If there are special comments, add them to the transaction_special_comments table ############################################
            for comment_id in special_comments_ids:
                comment_relation = TransactionSpecialComments(
                    special_comments_id=comment_id,
                    dish_id=new_transaction.dish_id,
                    invoice_id=new_transaction.invoice_id,
                    transaction_id=new_transaction.transaction_id
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
            IngredientStatus = deductIngredients(new_transaction.dish_id,new_transaction.quantity)


        # Commit the changes to the database
        db.session.commit()
        print("Emitting update event")


        listOfOrderID[new_invoice.invoice_id]=color
        print("ListOfOrderID")
        print(listOfOrderID)
        print("AvaiableCOlors")
        print(available_colors)
        print("UnavaiableCOlors")
        print(unavailable_colors)
        


        # Fetch and increment the order number
        order_number_entry = OrderNumberStore.query.first()
        if not order_number_entry:
            # First-time setup
            order_number_entry = OrderNumberStore(current_order_number=1)
            db.session.add(order_number_entry)
            current_order_number = 1
        else:
            current_order_number = order_number_entry.current_order_number + 1
            order_number_entry.current_order_number = current_order_number
        
        new_invoice.order_number = current_order_number
        # Prepare the overall response data
        response_data = {
            "invoice_id": new_invoice.invoice_id,
            "date_time": date_time,
            "total_price": total_price,
            "invoice_status": invoice_status,
            "color": color,  # Include the color
            "transactions": transactions_response_data,  # Include transactions data with special comments
            "order_number": new_invoice.order_number
        }
        # Emit the response data to connected clients using Socket.io
        socketio.emit('update', {'data': response_data})
        db.session.commit() 

        # Return a success message along with the ID of the created invoice
        return jsonify({"message": "Invoice, transactions, special comments, and discount status updated successfully!", "invoice_id": new_invoice.invoice_id,"Order_number":current_order_number, IngredientStatus: IngredientStatus}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@transaction.route('/api/admin/reset_order_number', methods=['POST'])
def reset_order_number():
    try:
        order_number_entry = OrderNumberStore.query.first()
        if not order_number_entry:
            return jsonify({"message": "Order number not initialized yet"}), 404

        order_number_entry.current_order_number = 0  # Resetting the order number to 0
        db.session.commit()
        available_colors.update(unavailable_colors)
        unavailable_colors.clear()
        ("ListOfOrderID")
        print(listOfOrderID)
        print("AvaiableCOlors")
        print(available_colors)
        print("UnavaiableCOlors")
        print(unavailable_colors)
        return jsonify({"message": "Order number reset successfully"}), 200

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
                    comments = TransactionSpecialComments.query.filter_by(transaction_id=transaction.transaction_id).all()
                    for comment_relation in comments:
                        comment = special_comments.query.get(comment_relation.special_comments_id)
                        if comment:  # Ensure comment exists
                            transaction_data["special_comments"].append({
                                "comment_id": comment.special_comments_id,
                                "text": comment.special_comments,
                                "price":comment.special_comments_price,
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
                "order_number": invoice.order_number,
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
                    transaction_data["dish_type"] = dish.dish_type
                    transaction_data["tag"] = dish.tag

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
                invoice_data = {
                    "invoice_id": invoice.invoice_id,
                    "date_time": invoice.date_time,
                    "total_price": invoice.total_price,
                    "invoice_status": invoice.invoice_status,\
                    "order_number": invoice.order_number,
                    "color": invoice.color,
                    "transactions": [],
                    "discounts": []
                }

                transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()
                for transaction in transactions:
                    # Fetch the dish using the dish_id from the transaction
                    dish = dishes.query.get(transaction.dish_id)
                    
                    if dish:
                        transaction_data = {
                            "dish_id": transaction.dish_id,
                            "quantity": transaction.quantity,
                            "with_special_comments": transaction.with_special_comments,
                            "special_comments": []
                        }

                        transaction_data["dish_name"] = dish.dish_name
                        transaction_data["dish_type"] = dish.dish_type
                        transaction_data["tag"] = dish.tag

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
                # Include this invoice in results only if it has at least one 'Fried' tag transaction
                if any(transaction_data["tag"] == "Fried" for transaction_data in invoice_data["transactions"]):
                    results.append(invoice_data)

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400



@transaction.route('/api/admin/fetch_drink_transactions', methods=['GET'])
def fetch_drink_transactions():
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
                    "order_number": invoice.order_number,
                    "color": invoice.color,
                    "transactions": [],
                    "discounts": []
                }

                transactions = Transactions.query.filter_by(invoice_id=invoice.invoice_id).all()

                for transaction in transactions:
                    # Fetch the dish using the dish_id from the transaction
                    dish = dishes.query.get(transaction.dish_id)
                    
                    if dish:
                        transaction_data = {
                            "dish_id": transaction.dish_id,
                            "quantity": transaction.quantity,
                            "with_special_comments": transaction.with_special_comments,
                            "special_comments": []
                        }

                        transaction_data["dish_name"] = dish.dish_name
                        transaction_data["dish_type"] = dish.dish_type
                        transaction_data["tag"] = dish.tag

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

                # Include this invoice in results only if it has at least one 'Fried' tag transaction
                if any(transaction_data["tag"] == "Drink" for transaction_data in invoice_data["transactions"]):
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
                comments = TransactionSpecialComments.query.filter_by(transaction_id=transaction.transaction_id).all()
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
        
        print("Before pop:", invoice_id, listOfOrderID)
        completed_invoice_color = listOfOrderID.get(invoice_id)
        listOfOrderID.pop(invoice_id, None)
        print("After pop:", invoice_id, listOfOrderID)
        found_gray_500 = False
        print(completed_invoice_color)        
        # Update the invoice_status
        invoice.invoice_status = "completed"
        
        # Commit the changes
        db.session.commit()
        
        for order_id, color in listOfOrderID.items():
            if color == "gray.500":
                found_gray_500 = True
                listOfOrderID[order_id]=completed_invoice_color
                socketio.emit('updateColor', {'invoice_id': order_id, 'color': completed_invoice_color})
                break

        if not found_gray_500 and completed_invoice_color is not None:
            available_colors.add(completed_invoice_color)
            unavailable_colors.discard(completed_invoice_color)
            print("No backlog orders")

        socketio.emit('completeOrder')

        print("ListOfOrderID")
        print(listOfOrderID)
        print("AvaiableCOlors")
        print(available_colors)
        print("UnavaiableCOlors")
        print(unavailable_colors)    
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
        
        print("Before pop:", invoice_id, listOfOrderID)
        completed_invoice_color = listOfOrderID.get(invoice_id)
        listOfOrderID.pop(invoice_id, None)
        print("After pop:", invoice_id, listOfOrderID)
        # Update the invoice_status
        invoice.invoice_status = "cancelled"
        found_gray_500 = False
        db.session.commit()
        for order_id, color in listOfOrderID.items():
            if color == "gray.500":
                found_gray_500 = True
                listOfOrderID[order_id]=completed_invoice_color
                socketio.emit('updateColor', {'invoice_id': order_id, 'color': completed_invoice_color})
                break
        
        if not found_gray_500 and completed_invoice_color is not None:
            available_colors.add(completed_invoice_color)
            unavailable_colors.discard(completed_invoice_color)
            print("No backlog orders")

        socketio.emit('cancelOrder')
        print("ListOfOrderID")
        print(listOfOrderID)
        print("AvaiableCOlors")
        print(available_colors)
        print("UnavaiableCOlors")
        print(unavailable_colors)
        return jsonify({"message": "Invoice status cancelled successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@transaction.route('/api/ticketing/update_invoice_colors/<int:invoice_id>', methods=['POST'])
def update_invoice_colors(invoice_id):
    try:
        # Fetch the specific invoice using the provided invoice_id
        invoice = Invoice.query.get(invoice_id)
        # Update the invoice_status
        request_data = request.get_json()
        # Extract the 'color' value from the request data
        color = request_data.get('color')    
        invoice.color=str(color)
        # Commit the changes
        db.session.commit()
        # Check if the invoice exists
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
            # socketio.emit('updateColor')


        return jsonify({"message": "Invoice "+str(invoice_id)+" assigned color successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@transaction.route('/api/ticketing/fetch_all_transactions', methods=['GET'])
def fetch_all_transactions():
    transactions = db.session.query(Transactions, dishes, Invoice).join(dishes, Transactions.dish_id == dishes.dish_id).join(Invoice, Transactions.invoice_id == Invoice.invoice_id).all()

    response = []
    for transaction in transactions:
        if not response or response[-1]['transaction']['invoice']['invoice_id'] != transaction.Invoice.invoice_id:
            invoice = {
                'invoice_id': transaction.Invoice.invoice_id,
                'invoice_status': transaction.Invoice.invoice_status,
                'total_price': transaction.Invoice.total_price,
                'date_time': transaction.Invoice.date_time
            }
            dishesList = [
                {
                    'dish_id': transaction.dishes.dish_id,
                    'dish_name': transaction.dishes.dish_name,
                    'dish_qty': transaction.Transactions.quantity
                }
            ]
            response.append({
                'transaction': {
                    'transaction_id': transaction.Transactions.transaction_id,
                    'dish': dishesList,
                    'invoice': invoice
                }
            })
        else:
            response[-1]['transaction']['dish'].append({
                'dish_id': transaction.dishes.dish_id,
                'dish_name': transaction.dishes.dish_name,
                'dish_qty': transaction.Transactions.quantity
            })

    return jsonify(response)

