from flask import Blueprint, request, jsonify


from ..extensions import db
from ..models.user import admin_user

user = Blueprint('user', __name__)

@user.route('/user1/<string:name>')
def create_user(name):
    user = admin_user.query.filter_by(name=name).first()
    return {'user': user.role}


# from werkzeug.security import generate_password_hash, check_password_hash

@user.route('/userAuth', methods=['POST'])
def Auth_user():
    data = request.get_json()  # get the request data in JSON format
    username = data.get('username')
    password = data.get('password')

    user = admin_user.query.filter_by(name=username, password=password).first()
    if user:
        return jsonify({'result': 'true'})
    else:
        return jsonify({'result': 'false'})