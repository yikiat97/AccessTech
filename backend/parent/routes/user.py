from flask import Blueprint, request, jsonify

from ..extensions import db
from ..models.user import admin_user
# from flask import Flask, session, redirect, url_for, escape, request
# from werkzeug.security import generate_password_hash, check_password_hash

user = Blueprint('user', __name__)
# user.secret_key = 'any random string'


@user.route('/api/getAllAdminDetails', methods=['GET'])
def get_all_user_details():
    # Query the database to retrieve all user details
    all_users = admin_user.query.all()

    # Create a list to store user details
    user_details = []

    # Iterate through the user objects and extract relevant information
    for user in all_users:
        user_details.append({
            'admin_id': user.admin_id,
            'password': user.password,
            'name': user.name,
            'role': user.role,
        })

    return jsonify({'user_details': user_details})



############################## Login function Check Username and password in database ###########################
@user.route('/api/userAuth', methods=['POST'])
def Auth_user():
    data = request.get_json()  # get the request data in JSON format
    username = data.get('username')
    password = data.get('password')

    user = admin_user.query.filter_by(name=username, password=password).first()
    if user:
        return jsonify({'result': True})
    else:
        return jsonify({'result': False})


# @user.route('/')
# def index():
   
#    if 'username' in session:
#       username = session['username']
#          return 'Logged in as ' + username + '<br>' + "<b><a href = '/logout'>click here to log out</a></b>"
#    return "You are not logged in <br><a href = '/login'>" + "click here to log in</a>"

# @app.route('/login', methods = ['GET', 'POST'])
# def login():
#    if request.method == 'POST':
#       session['username'] = request.form['username']
#       return redirect(url_for('index'))
#    return '''
	
#    <form action = "" method = "post">
#       <p><input type = text name = username/></p>
#       <p<<input type = submit value = Login/></p>
#    </form>	
# '''

# @app.route('/logout')
# def logout():
#    # remove the username from the session if it is there
#    session.pop('username', None)
#    return redirect(url_for('index'))

############################## Insert new admin User ##############################
@user.route('/api/addUser', methods=['POST'])
def add_user():
    data = request.get_json() 
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    # Check if a user with the same username already exists
    existing_user = admin_user.query.filter_by(name=username).first()
    if existing_user:
        return jsonify({'result': 'User with this username already exists'}), 400

    new_user = admin_user(name=username, password=password, role=role)
    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({'result': 'User created successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while creating the user: ' + str(e)}), 500
    

############################## Update admin User ##############################
@user.route('/api/updateUser/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()  # get the request data in JSON format
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # assuming you also send the role in the request

    user_to_update = admin_user.query.get(user_id)

    if not user_to_update:
        return jsonify({'result': 'User not found'}), 404

    user_to_update.name = username if username else user_to_update.name
    user_to_update.password = password if password else user_to_update.password
    user_to_update.role = role if role else user_to_update.role

    try:
        db.session.commit()
        return jsonify({'result': 'User updated successfully'})
    except Exception as e:
        db.session.rollback()  # rollback the changes in case of error
        return jsonify({'result': 'An error occurred while updating the user: ' + str(e)}), 500