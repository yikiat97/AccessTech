from flask import Blueprint, request, jsonify
import random
from sqlalchemy.orm import joinedload

from ..extensions import db
from ..models.transaction import Transactions
from ..models.invoice import Invoice
from ..models.discount import Discount
from ..models.dish import dishes
from ..models.discount_invoice import DiscountInvoice
from ..models.special_comments import special_comments
from ..models.transaction_special_comments import TransactionSpecialComments



transaction = Blueprint('transaction', __name__)

@transaction.route('/admin/add_invoice', methods=['POST'])
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
            invoice_status=invoice_status
        )
        
        db.session.add(new_invoice)
        db.session.flush()  # Flush to get the invoice_id

        # Linking the discount to the invoice without modifying the model
        if discount_id:
            discount_invoice_entry = DiscountInvoice(discount_id=discount_id, invoice_id=new_invoice.invoice_id)
            db.session.add(discount_invoice_entry)

        # Add transactions to the new invoice
        for trans_data in transactions_data:
            special_comments_ids = trans_data.get('special_comments_id', [])
            
            new_transaction = Transactions(
                dish_id=trans_data.get('dish_id'),
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
        
        db.session.commit()

        # Return a success message along with the ID of the created invoice
        return jsonify({"message": "Invoice, transactions, and special comments added successfully!", "invoice_id": new_invoice.invoice_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400






@transaction.route('/admin/fetch_invoice_details', methods=['GET'])
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

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 400



@transaction.route('/admin/fetch_invoice_parameter', methods=['GET'])
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

        invoices = query.all()

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
                "transactions": [],
                "discounts": []
            }

            for transaction in transactions:
                transaction_data = {
                    "dish_id": transaction.dish_id,
                    "with_special_comments": transaction.with_special_comments,
                    "special_comments": []
                }

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
