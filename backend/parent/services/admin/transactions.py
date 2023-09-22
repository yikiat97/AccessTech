from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.transactions import transactions
# from ..models.video import Video

transactions_inventory = Blueprint('transactions_inventory', __name__)

# @order.route('/order/<name>')
# def create_user(name):
#     user = admin_user(name=name)
#     db.session.add(user)
#     db.session.commit()

@transactions_inventory.route('/transactions/getAlltransactions', methods=['GET'])
def get_all_transactions():
    # Fetch all transactions
    all_transactions = transactions.query.all()

    # Convert transactions to JSON
    transactions_list = [{'transactions_id': transactions.transactions_id,
                         'transactions_name': transactions.transactions_name,
                         'transactions_type': transactions.transactions_type,
                         'transactions_qty': transactions.transactions_qty} 
                        for transactions in all_transactions]
    
    return jsonify(transactions_list)


@transactions_inventory.route('/transactions/addtransactions', methods=['POST'])
def add_transactions():
    data = request.get_json()

    # Extract data for the transactions
    transactions_name = data.get('transactions_name')
    transactions_type = data.get('transactions_type')
    transactions_qty = data.get('transactions_qty')

    # Check if an transactions with the same name already exists
    existing_transactions = transactions.query.filter_by(transactions_name=transactions_name).first()
    if existing_transactions:
        return jsonify({'result': 'transactions with this name already exists'}), 400

    new_transactions = transactions(transactions_name=transactions_name, transactions_type=transactions_type, transactions_qty=transactions_qty)
    db.session.add(new_transactions)

    try:
        db.session.commit()
        return jsonify({'result': 'transactions added successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while adding the transactions: ' + str(e)}), 500
    

@transactions_inventory.route('/transactions/updatetransactions/<int:transactions_id>', methods=['PUT'])
def update_transactions(transactions_id):
    data = request.get_json()

    # Extract data for the transactions
    transactions_name = data.get('transactions_name')
    transactions_type = data.get('transactions_type')
    transactions_qty = data.get('transactions_qty')

    # Fetch the transactions to update
    updatetransactions = transactions.query.get(transactions_id)
    if not updatetransactions:
        return jsonify({'result': 'No transactions found with this ID'}), 404

    # Update the transactions
    updatetransactions.transactions_name = transactions_name
    updatetransactions.transactions_type = transactions_type
    updatetransactions.transactions_qty = transactions_qty

    try:
        db.session.commit()
        return jsonify({'result': 'transactions updated successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while updating the transactions: ' + str(e)}), 500