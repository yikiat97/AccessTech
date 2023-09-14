from flask import  jsonify

from ...extensions import db
from ...models.transaction import Transactions
from ...models.invoice import Invoice
from ...models.discount import Discount
from ...models.dish import dishes
from ...models.discount_invoice import DiscountInvoice
from ...models.special_comments import special_comments
from ...models.transaction_special_comments import TransactionSpecialComments





def add_invoice(ticketingOrderDetails):
    try:
        # Extract data from the request
        data = ticketingOrderDetails
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
        
        db.session.commit()

        # Return a success message along with the ID of the created invoice
        return jsonify({"message": "Invoice, transactions, and special comments added successfully!", "invoice_id": new_invoice.invoice_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400