from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models.discount import Discount
from datetime import datetime

discount_blueprint = Blueprint('discount_blueprint', __name__)

#### Insert Singular voucher code
@discount_blueprint.route('/api/discount/add', methods=['POST'])
def add_discount():
    try:
        data = request.get_json()

        discount_name = data.get('discount_name')
        code = data.get('code')
        discount_status = data.get('discount_status')
        discount_percent = data.get('discount_percent')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # Check if a discount with the same code already exists
        existing_discount = Discount.query.filter_by(code=code).first()
        if existing_discount:
            return jsonify({'result': 'A discount with this code already exists'}), 400

        # Create a new discount
        new_discount = Discount(discount_name=discount_name, 
                        code=code, 
                        discount_status=discount_status, 
                        discount_percent=discount_percent, 
                        start_date=start_date, 
                        end_date=end_date)
        db.session.add(new_discount)
        db.session.commit()

        return jsonify({'result': 'Discount added successfully'}), 200

    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while adding the discount: ' + str(e)}), 500



#### Get function to verify voucher exist and within start and end date
@discount_blueprint.route('/api/discount/check-voucher', methods=['GET'])
def check_voucher():
    try:
        voucher_code = request.args.get('voucher_code')
        if not voucher_code:
            return jsonify({'result': 'Please provide a voucher code'}), 400

        # Query the database for the voucher
        voucher = Discount.query.filter_by(code=voucher_code).first()

        # If voucher is not found
        if not voucher:
            return jsonify({'result': 'Voucher not found'}), 404
        
        # If voucher status is not active
        if voucher.discount_status != "active":
            return jsonify({'result': 'Voucher is not active'}), 400

        # If voucher is found and active, check the date validity
        current_time = datetime.now()
        
        if voucher.start_date <= current_time <= voucher.end_date:
            return jsonify({'result': 'Voucher is valid', 
                            'discount_name': voucher.discount_name, 
                            'discount_percent': voucher.discount_percent,
                            'discount_id' : voucher.discount_id}), 200,
        else:
            return jsonify({'result': 'Voucher is not valid within the current date range'}), 400

    except Exception as e:
        print(current_time)
        return jsonify({'result': 'An error occurred while checking the voucher: ' + str(e)}), 500