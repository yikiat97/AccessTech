from ..parent.extensions import db
from unittest.mock import patch, Mock
import pytest

from flask import Flask 
from flask_cors import CORS
# from ..parent.extensions import socketio
from datetime import datetime, timedelta

from ..parent import create_app

from ..parent.extensions import db, migrate

from ..parent.models.dish import dishes
from ..parent.models.discount import Discount
from ..parent.models.ingredient import ingredients
from ..parent.models.invoice import Invoice
from ..parent.models.special_comments import special_comments
from ..parent.models.transaction_special_comments import TransactionSpecialComments
from ..parent.models.transaction import Transactions
from ..parent.models.recipe import recipes
from ..parent.models.user import admin_user

from dotenv import load_dotenv
import os

# load all environment variables
load_dotenv()

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_db.sqlite'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()

    with app.test_client() as client:
        yield client
    
    with app.app_context():
        db.drop_all()
        db.session.remove()

def test_ingredients_crud_operations(client):
    # Create
    new_ingredient = ingredients(ingredients_name='Salt', ingredients_type='Spice', ingredients_qty=0.5)
    db.session.add(new_ingredient)
    db.session.commit()

    # Read
    retrieved_ingredient = ingredients.query.filter_by(ingredients_name='Salt').first()
    assert retrieved_ingredient is not None
    assert retrieved_ingredient.ingredients_name == 'Salt'
    assert retrieved_ingredient.ingredients_type == 'Spice'
    assert retrieved_ingredient.ingredients_qty == 0.5

    # Update
    retrieved_ingredient.ingredients_name = 'Pepper'
    retrieved_ingredient.ingredients_qty = 0.6
    db.session.commit()
    updated_ingredient = ingredients.query.get(retrieved_ingredient.ingredients_id)
    assert updated_ingredient.ingredients_name == 'Pepper'
    assert updated_ingredient.ingredients_qty == 0.6

    # Delete
    db.session.delete(updated_ingredient)
    db.session.commit()
    assert ingredients.query.get(retrieved_ingredient.ingredients_id) is None


def test_discount_crud_operations(client):
    # Create
    new_discount = Discount(
        discount_name='Test Discount',
        code='TEST123',
        discount_status='Active',
        discount_percent=10.0,
        start_date=datetime(2023, 10, 1),
        end_date=datetime(2023, 10, 31)
    )
    db.session.add(new_discount)
    db.session.commit()

    # Read
    retrieved_discount = Discount.query.filter_by(code='TEST123').first()
    assert retrieved_discount is not None
    assert retrieved_discount.discount_name == 'Test Discount'
    assert retrieved_discount.code == 'TEST123'
    assert retrieved_discount.discount_status == 'Active'
    assert retrieved_discount.discount_percent == 10.0
    assert retrieved_discount.start_date == datetime(2023, 10, 1)
    assert retrieved_discount.end_date == datetime(2023, 10, 31)

    # Update
    retrieved_discount.discount_name = 'Updated Discount'
    retrieved_discount.discount_percent = 15.0
    db.session.commit()
    updated_discount = Discount.query.get(retrieved_discount.discount_id)
    assert updated_discount.discount_name == 'Updated Discount'
    assert updated_discount.discount_percent == 15.0

    # Delete
    db.session.delete(updated_discount)
    db.session.commit()
    assert Discount.query.get(retrieved_discount.discount_id) is None


def test_dishes_crud_operations(client):
    # Create
    new_dish = dishes(
        dish_name='Test Dish',
        price=9.99,
        image_url='test_image.jpg',
        small_desc='Test Description',
        description='This is a test dish description.',
        dish_type='Main Course',
        tag='Test Tag',
        qty=10,
        placement='Specials'
    )

    db.session.add(new_dish)
    db.session.commit()

    # Read
    retrieved_dish = dishes.query.filter_by(dish_name='Test Dish').first()
    assert retrieved_dish is not None
    assert retrieved_dish.dish_name == 'Test Dish'
    assert retrieved_dish.price == 9.99
    assert retrieved_dish.image_url == 'test_image.jpg'
    assert retrieved_dish.small_desc == 'Test Description'
    assert retrieved_dish.description == 'This is a test dish description.'
    assert retrieved_dish.dish_type == 'Main Course'
    assert retrieved_dish.tag == 'Test Tag'
    assert retrieved_dish.qty == 10
    assert retrieved_dish.placement == 'Specials'

    # Update
    retrieved_dish.dish_name = 'Updated Dish'
    retrieved_dish.price = 12.99
    db.session.commit()
    updated_dish = dishes.query.get(retrieved_dish.dish_id)
    assert updated_dish.dish_name == 'Updated Dish'
    assert updated_dish.price == 12.99

    # Delete
    db.session.delete(updated_dish)
    db.session.commit()
    assert dishes.query.get(retrieved_dish.dish_id) is None


def test_invoice_crud_operations(client):
    # Create
    new_invoice = Invoice(
        date_time=datetime(2023, 10, 26, 14, 30),
        total_price=100.0,
        queue_num=1,
        invoice_status='Paid',
        color='Green',
        order_number=123
    )

    db.session.add(new_invoice)
    db.session.commit()

    # Read
    retrieved_invoice = Invoice.query.filter_by(order_number=123).first()
    assert retrieved_invoice is not None
    assert retrieved_invoice.date_time == datetime(2023, 10, 26, 14, 30)
    assert retrieved_invoice.total_price == 100.0
    assert retrieved_invoice.queue_num == 1
    assert retrieved_invoice.invoice_status == 'Paid'
    assert retrieved_invoice.color == 'Green'
    assert retrieved_invoice.order_number == 123

    # Update
    retrieved_invoice.total_price = 150.0
    retrieved_invoice.invoice_status = 'Refunded'
    db.session.commit()
    updated_invoice = Invoice.query.get(retrieved_invoice.invoice_id)
    assert updated_invoice.total_price == 150.0
    assert updated_invoice.invoice_status == 'Refunded'

    # Delete
    db.session.delete(updated_invoice)
    db.session.commit()
    assert Invoice.query.get(retrieved_invoice.invoice_id) is None


def test_recipes_crud_operations(client):
    # Create
    # Create a new dish and ingredient record for testing
    dish = dishes(
        dish_name='Test Dish',
        price=9.99,
        image_url='test_image.jpg',
        small_desc='Test Description',
        description='This is a test dish description.',
        dish_type='Main Course',
        tag='Test Tag',
        qty=10,
        placement='Specials'
    )
    db.session.add(dish)

    ingredient = ingredients(
        ingredients_name='Test Ingredient',
        ingredients_type='Test Type',
        ingredients_qty=50.0  # Adjust the quantity as needed
    )
    db.session.add(ingredient)

    recipe = recipes(
        dish_id=dish.dish_id,  # Use the ID of the newly created dish
        ingredient_id=ingredient.ingredients_id,  # Use the ID of the newly created ingredient
        ingredient_qty_needed=2.0  # Adjust the required quantity
    )

    db.session.add(recipe)
    db.session.commit()

    # Read
    # Fetch the recipe from the database
    retrieved_recipe = recipes.query.filter_by(dish_id=dish.dish_id, ingredient_id=ingredient.ingredients_id).first()
    assert retrieved_recipe is not None
    assert retrieved_recipe.dish_id == dish.dish_id
    assert retrieved_recipe.ingredient_id == ingredient.ingredients_id
    assert retrieved_recipe.ingredient_qty_needed == 2.0  # Adjust the expected quantity

    # Update
    retrieved_recipe.ingredient_qty_needed = 3.0  # Adjust the new quantity
    db.session.commit()
    updated_recipe = recipes.query.filter_by(dish_id=dish.dish_id, ingredient_id=ingredient.ingredients_id).first()
    assert updated_recipe.ingredient_qty_needed == 3.0

    # Delete
    db.session.delete(updated_recipe)
    db.session.commit()
    assert recipes.query.filter_by(dish_id=dish.dish_id, ingredient_id=ingredient.ingredients_id).first() is None


def test_special_comments_crud_operations(client):
    # Create
    # Create a new special comment for testing
    special_comment = special_comments(
        special_comments='Test Special Comment',
        special_comments_price=5.0,  # Adjust the price as needed
        dish_id=None  # Set to None to indicate no specific dish
    )
    db.session.add(special_comment)
    db.session.commit()

    # Read
    retrieved_special_comment = special_comments.query.filter_by(special_comments='Test Special Comment').first()
    assert retrieved_special_comment is not None
    assert retrieved_special_comment.special_comments == 'Test Special Comment'
    assert retrieved_special_comment.special_comments_price == 5.0  # Adjust the expected price
    assert retrieved_special_comment.dish_id is None  # Ensure that there's no specific dish associated

    # Update
    retrieved_special_comment.special_comments_price = 6.0  # Adjust the new price
    db.session.commit()
    updated_special_comment = special_comments.query.filter_by(special_comments='Test Special Comment').first()
    assert updated_special_comment.special_comments_price == 6.0

    # Delete
    db.session.delete(updated_special_comment)
    db.session.commit()
    assert special_comments.query.filter_by(special_comments='Test Special Comment').first() is None


def test_transaction_special_comments_crud_operations(client):
    # Create
    # Create new instances of transactions, special comments, and dishes for testing
    transaction = Transactions(date_time=datetime(2023, 10, 26, 14, 30))  # Replace with your desired date and time
    db.session.add(transaction)

    special_comment = special_comments(
        special_comments='Test Special Comment',
        special_comments_price=5.0,  # Adjust the price as needed
        dish_id=None  # Set to None if not associated with a specific dish
    )
    db.session.add(special_comment)

    dish = dishes(
        dish_name='Test Dish',
        price=9.99,
        image_url='test_image.jpg',
        small_desc='Test Description',
        description='This is a test dish description.',
        dish_type='Main Course',
        tag='Test Tag',
        qty=10,
        placement='Specials'
    )
    db.session.add(dish)

    # Now, you can use the IDs of the newly created instances in the transaction special comment
    transaction_id = transaction.transaction_id
    special_comments_id = special_comment.special_comments_id
    dish_id = dish.dish_id

    transaction_special_comment = TransactionSpecialComments(
        transaction_id=transaction_id,
        special_comments_id=special_comments_id,
        dish_id=dish_id,
        invoice_id=None  # Set to None if there's no specific invoice associated
    )

    db.session.add(transaction_special_comment)
    db.session.commit()

    # Read
    retrieved_transaction_special_comment = TransactionSpecialComments.query.filter_by(
        transaction_id=transaction_id,
        special_comments_id=special_comments_id,
        dish_id=dish_id
    ).first()
    assert retrieved_transaction_special_comment is not None
    assert retrieved_transaction_special_comment.transaction_id == transaction_id
    assert retrieved_transaction_special_comment.special_comments_id == special_comments_id
    assert retrieved_transaction_special_comment.dish_id == dish_id
    assert retrieved_transaction_special_comment.invoice_id is None  # Ensure no specific invoice

    # Update
    retrieved_transaction_special_comment.transaction_id = 2  # Adjust the new transaction ID
    db.session.commit()
    updated_transaction_special_comment = TransactionSpecialComments.query.filter_by(
        transaction_id=2,  # Use the updated transaction ID
        special_comments_id=special_comments_id,
        dish_id=dish_id
    ).first()
    assert updated_transaction_special_comment.transaction_id == 2

    # Delete
    db.session.delete(updated_transaction_special_comment)
    db.session.commit()
    assert TransactionSpecialComments.query.filter_by(
        transaction_id=2,  # Use the updated transaction ID
        special_comments_id=special_comments_id,
        dish_id=dish_id
    ).first() is None


def test_transactions_crud_operations(client): #if no existing dishes and invoice
    # Create
    # Create new instances of dishes and invoice for testing
    dish = dishes(
        dish_name='Test Dish',
        price=9.99,
        image_url='test_image.jpg',
        small_desc='Test Description',
        description='This is a test dish description.',
        dish_type='Main Course',
        tag='Test Tag',
        qty=10,
        placement='Specials'
    )
    db.session.add(dish)

    invoice = Invoice(date_time=datetime(2023, 10, 26, 14, 30))  # Replace with your desired date and time
    db.session.add(invoice)

    # Now, you can use the IDs of the newly created instances in the transaction
    dish_id = dish.dish_id
    invoice_id = invoice.invoice_id

    transaction = Transactions(
        dish_id=dish_id,
        invoice_id=invoice_id,
        quantity=2,  # Adjust the quantity as needed
        with_special_comments=True  # Adjust the value as needed
    )

    db.session.add(transaction)
    db.session.commit()

    # Read
    retrieved_transaction = Transactions.query.filter_by(dish_id=dish_id, invoice_id=invoice_id).first()
    assert retrieved_transaction is not None
    assert retrieved_transaction.dish_id == dish_id
    assert retrieved_transaction.invoice_id == invoice_id
    assert retrieved_transaction.quantity == 2  # Adjust the expected quantity
    assert retrieved_transaction.with_special_comments is True  # Adjust the expected value

    # Update
    retrieved_transaction.quantity = 5  # Adjust the new quantity
    db.session.commit()
    updated_transaction = Transactions.query.filter_by(dish_id=dish_id, invoice_id=invoice_id).first()
    assert updated_transaction.quantity == 5

    # Delete
    db.session.delete(updated_transaction)
    db.session.commit()
    assert Transactions.query.filter_by(dish_id=dish_id, invoice_id=invoice_id).first() is None


def test_admin_user_crud_operations(client):
    # Create
    admin = admin_user(
        name='TestAdmin',
        password='TestPassword',
        role='Admin'
    )
    db.session.add(admin)
    db.session.commit()

    # Read
    retrieved_admin = admin_user.query.filter_by(name='TestAdmin').first()
    assert retrieved_admin is not None
    assert retrieved_admin.name == 'TestAdmin'
    assert retrieved_admin.password == 'TestPassword'
    assert retrieved_admin.role == 'Admin'

    # Update
    retrieved_admin.password = 'NewPassword'
    db.session.commit()
    updated_admin = admin_user.query.filter_by(name='TestAdmin').first()
    assert updated_admin.password == 'NewPassword'

    # Delete
    db.session.delete(updated_admin)
    db.session.commit()
    assert admin_user.query.filter_by(name='TestAdmin').first() is None

