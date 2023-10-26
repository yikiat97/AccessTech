# from app import create_app
from parent.extensions import db
from unittest.mock import patch, Mock
import pytest

from flask import Flask 
from flask_cors import CORS
from parent.extensions import socketio
from datetime import datetime, timedelta

from parent.extensions import db, migrate
from parent.routes.order import order
from parent.routes.user import user
from parent.routes.ingredient import ingredient_inventory
from parent.routes.transaction import transaction
from parent.routes.payment import payment
from parent.routes.discount import discount_blueprint
from parent.routes.payment import calculate_order_amount

import json

from dotenv import load_dotenv
import os

# load all environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(app)

    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(order)
    app.register_blueprint(user)
    app.register_blueprint(ingredient_inventory)
    app.register_blueprint(transaction)
    app.register_blueprint(payment)
    app.register_blueprint(discount_blueprint)

    socketio.init_app(app)

    
    return app
    
app = create_app()
if __name__ == '__main__':
    app.run(port=8080)


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_db.sqlite'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()
            db.session.close()

# @pytest.fixture # For Payment testing
# def client(app):
#     return app.test_client()

# DISCOUNT ROUTE

def test_add_discount_route(client):
    # Test the 'add_discount' route

    # Prepare a JSON request data
    data = {
        'discount_name': 'Test Discount',
        'code': 'TEST123',
        'discount_status': 'Active',
        'discount_percent': 10.0,
        'start_date': '2023-10-01',
        'end_date': '2023-10-31'
    }

    response = client.post('/api/discount/add', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Discount added successfully'

def test_check_voucher_route(client):
    # Test the 'check_voucher' route

    # Prepare a voucher code for testing
    voucher_code = 'TEST123'

    response = client.get(f'/api/discount/check-voucher?voucher_code={voucher_code}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Voucher is valid'
    assert response_data['discount_name'] == 'Test Discount'
    assert response_data['discount_percent'] == 10.0
    assert 'discount_id' in response_data  # Ensure discount_id is present

# INGREDIENT ROUTE

def test_get_all_ingredients_route(client):
    # Test the 'get_all_ingredients' route

    response = client.get('/api/ingredient/getAllIngredients')

    assert response.status_code == 200  # Ensure a successful response
    ingredients_list = json.loads(response.data)
    assert isinstance(ingredients_list, list)  # Ensure the response is a list of ingredients

def test_add_ingredient_route(client):
    # Test the 'add_ingredient' route

    # Prepare a JSON request data
    data = {
        'ingredients_name': 'New Ingredient',
        'ingredients_type': 'Test Type',
        'ingredients_qty': 50.0
    }

    response = client.post('/api/ingredient/addIngredients', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Ingredient added successfully'

def test_update_ingredient_route(client):
    # Test the 'update_ingredient' route

    # Prepare a JSON request data
    data = {
        'ingredients_name': 'Updated Ingredient',
        'ingredients_type': 'Test Type',
        'ingredients_qty': 75.0
    }

    ingredient_id = 1  # Replace with an existing ingredient ID to update

    response = client.put(f'/api/ingredient/updateIngredient/{ingredient_id}', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Ingredient updated successfully'

def test_delete_ingredient_route(client):
    # Test the 'delete_ingredient' route

    # Replace with an existing ingredient ID to delete
    ingredient_id = 1

    response = client.delete(f'/api/ingredient/deleteIngredient/{ingredient_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Ingredient deleted successfully'

# ORDER ROUTE

def test_get_all_dishes_route(client):
    # Test the 'get_all_dishes' route
    response = client.get('/api/order/getAllDishes')

    assert response.status_code == 200  # Ensure a successful response
    dishes_list = json.loads(response.data)
    assert isinstance(dishes_list, list)  # Ensure the response is a list of dishes

def test_get_student_dishes_route(client):
    # Test the 'get_student_dishes' route
    response = client.get('/api/order/getStudentDishes')

    assert response.status_code == 200  # Ensure a successful response
    student_dishes_list = json.loads(response.data)
    assert isinstance(student_dishes_list, list)  # Ensure the response is a list of student dishes

def test_get_public_dishes_route(client):
    # Test the 'get_public_dishes' route
    response = client.get('/api/order/getPublicDishes')

    assert response.status_code == 200  # Ensure a successful response
    public_dishes_list = json.loads(response.data)
    assert isinstance(public_dishes_list, list)  # Ensure the response is a list of public dishes

def test_update_dish_route(client):
    # Test the 'update_dish' route

    # Prepare a JSON request data
    data = {
        "dish_name": "Updated Dish Name",
        "price": 15.99,
        "image_url": "http://example.com/updated_image.jpg",
        "small_desc": "Updated description",
        "description": "Updated long description",
        "dish_type": "Updated Type",
        "tag": "Updated Tag",
        "qty": 10,  # Replace with the desired quantity
        "placement": "Updated Placement",
        "ingredients": [
            {
                "ingredients_id": 1,  # Replace with ingredient ID
                "ingredient_qty_needed": 5.0  # Replace with the desired quantity
            }
            # Add more ingredients as needed
        ]
    }

    dish_id = 1  # Replace with an existing dish ID to update

    response = client.put(f'/api/order/updateDish/{dish_id}', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Dish and its recipes updated successfully'

def test_add_dish_route(client):
    # Test the 'add_dish' route

    # Prepare a JSON request data for adding a new dish
    data = {
        'dish_name': 'New Dish',
        'price': 10.99,
        'image_url': 'http://example.com/new_dish_image.jpg',
        'small_desc': 'New Description',
        'description': 'New Long Description',
        'dish_type': 'New Type',
        'tag': 'New Tag',
        'qty': 20,  # Replace with the desired quantity
        'placement': 'New Placement',
        'ingredients': [
            {
                'ingredients_id': 2,  # Replace with ingredient ID
                'ingredient_qty_needed': 6.0  # Replace with the desired quantity
            }
            # Add more ingredients as needed
        ]
    }

    response = client.post('/api/order/addDish', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'Dish added successfully'

def test_delete_dish_route(client):
    # Test the 'delete_dish' route

    # Replace with an existing dish ID to delete
    dish_id = 1

    response = client.delete(f'/api/order/deleteDish/{dish_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['message'] == 'Dish and associated recipes deleted successfully'

def test_get_all_recipes_route(client):
    # Test the 'get_all_recipes' route

    response = client.get('/api/order/get_all_recipes')

    assert response.status_code == 200  # Ensure a successful response
    recipes_list = json.loads(response.data)
    assert isinstance(recipes_list, list)  # Ensure the response is a list of recipes

def test_insert_recipes_route(client):
    # Test the 'add_recipes' route

    # Prepare a JSON request data for inserting recipes
    data = [
        {
            'dish_id': 1,
            'ingredients_id': 1,
            'ingredient_qty_needed': 100.0
        },
        {
            'dish_id': 1,
            'ingredients_id': 2,
            'ingredient_qty_needed': 50.0
        }
    ]

    response = client.post('/api/order/InsertRecipes', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['message'] == 'New recipes added!'

def test_add_special_comment_route(client):
    # Test the 'add_special_comment' route

    # Prepare JSON request data for adding a special comment
    data = {
        'special_comments': 'Test Special Comment',
        'special_comments_price': 10.0,
        'dish_id': 1
    }

    response = client.post('/api/admin/add_special_comment', json=data)

    assert response.status_code == 201  # Ensure a successful creation response
    response_data = json.loads(response.data)
    assert response_data['message'] == 'Special comment added successfully!'

def test_get_special_comments_route(client):
    # Test the 'get_special_comments' route

    dish_id = 1  # Replace with an existing dish ID

    response = client.get(f'/api/order/get_special_comments/{dish_id}')

    assert response.status_code == 200  # Ensure a successful response
    comments_list = json.loads(response.data)
    assert isinstance(comments_list, list)  # Ensure the response is a list of special comments

def test_get_all_special_comments_route(client):
    # Test the 'get_all_special_comments' route

    response = client.get('/api/order/get_all_special_comments')

    assert response.status_code == 200  # Ensure a successful response
    comments_list = json.loads(response.data)
    assert isinstance(comments_list, list)  # Ensure the response is a list of special comments

def test_delete_special_comment_route(client):
    # Test the 'delete_special_comment' route

    # Replace with an existing special comment ID to delete
    comment_id = 1

    response = client.delete(f'/api/order/delete_special_comment/{comment_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['message'] == 'Special comment deleted successfully!'

def test_get_all_discounts_route(client):
    # Test the 'get_all_discounts' route

    response = client.get('/api/admin/get_all_discounts')

    assert response.status_code == 200  # Ensure a successful response
    discounts_list = json.loads(response.data)
    assert isinstance(discounts_list, list)  # Ensure the response is a list of discounts

def test_add_discount_route(client):
    # Test the 'add_discount' route

    # Prepare JSON request data for adding a discount
    data = {
        'discount_name': 'Test Discount',
        'code': 'TEST123',
        'discount_status': 'Active',
        'discount_percent': 10.0
    }

    response = client.post('/api/admin/add_discount', json=data)

    assert response.status_code == 201  # Ensure a successful creation response
    response_data = json.loads(response.data)
    assert response_data['message'] == 'Discount added successfully!'

def test_delete_discount_route(client):
    # Test the 'delete_discount' route

    # Replace with an existing discount ID to delete
    discount_id = 1

    response = client.delete(f'/api/admin/delete_discount/{discount_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['message'] == f'Discount with ID {discount_id} deleted successfully!'

# PAYMENT ROUTE

# May not work
def test_create_payment_route(client, mocker):
    # Create a mock for the stripe.PaymentIntent.create function
    mock_create_payment_intent = mocker.patch('stripe.PaymentIntent.create')
    
    # Define the expected response from the Stripe API (you can customize this)
    stripe_response = {
        'client_secret': 'test-client-secret'
    }
    
    # Set the return value of the mock to the expected response
    mock_create_payment_intent.return_value = stripe_response
    
    # Prepare the data to send in the POST request
    data = {
        'items': [
            {
                'product_id': 1,
                'quantity': 2,
                'price': 1000
            },
            {
                'product_id': 2,
                'quantity': 1,
                'price': 500
            }
        ]
    }
    
    # Send a POST request to the create_payment route
    response = client.post('/api/payment/create-payment-intent', data=json.dumps(data), content_type='application/json')
    
    # Ensure a successful response
    assert response.status_code == 200
    
    # Ensure the response matches the expected Stripe response
    response_data = json.loads(response.data)
    assert response_data['clientSecret'] == stripe_response['client_secret']
    
    # Assert that the stripe.PaymentIntent.create function was called with the correct arguments
    mock_create_payment_intent.assert_called_once_with(
        amount=calculate_order_amount(data['items']),
        currency='sgd',
        automatic_payment_methods={'enabled': True}
    )

# TRANSACTION ROUTE

def test_add_invoice(client):
    # Test the 'add_invoice' route

    data = {
        'date_time': '2023-10-26 10:00:00',
        'total_price': 100.0,
        'queue_num': 1,
        'invoice_status': 'Active',
        'discount_id': None,
        'transactions': []
    }

    response = client.post('/api/admin/add_invoice', json=data)

    assert response.status_code == 201  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'message' in response_data
    assert 'invoice_id' in response_data
    assert 'Order_number' in response_data

def test_reset_order_number(client):
    # Test the 'reset_order_number' route

    response = client.post('/api/admin/reset_order_number')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'message' in response_data

def test_fetch_invoice_details(client):
    # Test the 'fetch_invoice_details' route

    response = client.get('/api/admin/fetch_invoice_details')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert isinstance(response_data, list)

def test_fetch_invoice_parameter(client):
    # Test the 'fetch_invoice_parameter' route

    # Prepare query parameters
    invoice_status = 'Active'
    dish_type = 'fried'

    response = client.get(f'/api/admin/fetch_invoice_parameter?invoice_status={invoice_status}&dish_type={dish_type}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert isinstance(response_data, list)

def test_fetch_fried_transactions(client):
    # Test the 'fetch_fried_transactions' route

    # Prepare query parameters
    invoice_status = 'Active'
    dish_type = 'fried'

    response = client.get(f'/api/admin/fetch_fried_transactions?invoice_status={invoice_status}&dish_type={dish_type}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert isinstance(response_data, list)

def test_get_invoice_by_id(client):
    # Test the 'get_invoice_by_id' route

    invoice_id = 1  # Replace with a valid invoice_id from your test data

    response = client.get(f'/api/admin/get_invoice/{invoice_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'invoice_id' in response_data

def test_update_invoice_status_completed(client):
    # Test the 'update_invoice_status_completed' route

    invoice_id = 1  # Replace with a valid invoice_id from your test data

    response = client.put(f'/api/ticketing/update_invoice_status_completed/{invoice_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'message' in response_data

def test_update_invoice_status_cancel(client):
    # Test the 'update_invoice_status_cancel' route

    invoice_id = 1  # Replace with a valid invoice_id from your test data

    response = client.put(f'/api/ticketing/update_invoice_status_cancel/{invoice_id}')

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'message' in response_data

def test_update_invoice_colors(client):
    # Test the 'update_invoice_colors' route

    invoice_id = 1  # Replace with a valid invoice_id from your test data
    color = "green"  # Replace with a valid color

    data = {'color': color}
    response = client.post(f'/api/ticketing/update_invoice_colors/{invoice_id}', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert 'message' in response_data

# USER ROUTE

def test_auth_user(client):
    # Test the 'Auth_user' route

    # Prepare a JSON request data
    data = {
        'username': 'test_user',
        'password': 'test_password'
    }

    response = client.post('/api/userAuth', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] is True

def test_add_user(client):
    # Test the 'add_user' route

    # Prepare a JSON request data
    data = {
        'username': 'new_user',
        'password': 'new_password',
        'role': 'admin'
    }

    response = client.post('/api/addUser', json=data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'User created successfully'

def test_add_existing_user(client):
    # Test adding an existing user

    # First, add a user with the same username
    data = {
        'username': 'existing_user',
        'password': 'password',
        'role': 'admin'
    }
    client.post('/api/addUser', json=data)

    # Try to add the same user again
    data = {
        'username': 'existing_user',
        'password': 'new_password',
        'role': 'admin'
    }
    response = client.post('/api/addUser', json=data)

    assert response.status_code == 400  # Ensure a conflict response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'User with this username already exists'

def test_update_user(client):
    # Test the 'update_user' route

    # First, add a user to update
    data = {
        'username': 'user_to_update',
        'password': 'password',
        'role': 'user'
    }
    response = client.post('/api/addUser', json=data)
    response_data = json.loads(response.data)
    user_id = response_data.get('user_id')

    # Update the user
    updated_data = {
        'username': 'updated_user',
        'password': 'new_password',
        'role': 'admin'
    }
    response = client.put(f'/api/updateUser/{user_id}', json=updated_data)

    assert response.status_code == 200  # Ensure a successful response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'User updated successfully'

def test_update_nonexistent_user(client):
    # Test updating a nonexistent user

    user_id = 999  # Assuming this user ID does not exist
    updated_data = {
        'username': 'updated_user',
        'password': 'new_password',
        'role': 'admin'
    }
    response = client.put(f'/api/updateUser/{user_id}', json=updated_data)

    assert response.status_code == 404  # Ensure a not found response
    response_data = json.loads(response.data)
    assert response_data['result'] == 'User not found'

# if __name__ == '__main__':
#     pytest.main()