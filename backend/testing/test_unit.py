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

from parent.models.dish import dishes
from parent.models.discount import Discount
from parent.models.ingredient import ingredients
from parent.models.invoice import Invoice
from parent.models.special_comments import special_comments
from parent.models.transaction import Transactions

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


def test_dish_crud_operations(client):
    app = create_app()

    with app.app_context():
        # Create
        new_dish = dishes(dish_name="Sample Dish", price=10.0)
        db.session.add(new_dish)
        db.session.commit()

        # Confirm it's added by checking its ID
        assert new_dish.dish_id is not None

        # Read
        retrieved_dish = dishes.query.get(new_dish.dish_id)
        assert retrieved_dish.dish_name == "Sample Dish"

        # Update
        retrieved_dish.price = 12.0
        db.session.commit()
        updated_dish = dishes.query.get(new_dish.dish_id)
        assert updated_dish.price == 12.0

        # Delete
        db.session.delete(updated_dish)
        db.session.commit()
        assert dishes.query.get(new_dish.dish_id) is None



# def test_discount_crud_operations(client):
#     # Setup
#     start_date = datetime.now()
#     end_date = start_date + timedelta(days=10)
    
#     # Create
#     new_discount = Discount(
#         discount_name="Special Discount",
#         code="SPECIAL10",
#         discount_status="active",
#         discount_percent=10.0,
#         start_date=start_date,
#         end_date=end_date
#     )
#     with client.application.app_context():
#         db.session.add(new_discount)
#         db.session.commit()
    
#         # Confirm it's added by checking its ID
#         assert new_discount.discount_id is not None

#         # Read
#         retrieved_discount = Discount.query.get(new_discount.discount_id)
#         assert retrieved_discount.discount_name == "Special Discount"

#         # Update
#         retrieved_discount.discount_percent = 15.0
#         db.session.commit()
#         updated_discount = Discount.query.get(new_discount.discount_id)
#         assert updated_discount.discount_percent == 15.0

#         # Delete
#         db.session.delete(updated_discount)
#         db.session.commit()
#         assert Discount.query.get(new_discount.discount_id) is None



# def test_ingredients_crud_operations(client):
#     app = create_app()

#     with app.app_context():
#         # Create
#         new_ingredient = ingredients(
#             ingredients_name="Sample Ingredient", 
#             ingredients_type="Vegetable", 
#             ingredients_qty=10.0
#         )
#         db.session.add(new_ingredient)
#         db.session.commit()

#         # Confirm it's added by checking its ID
#         assert new_ingredient.ingredients_id is not None

#         # Read
#         retrieved_ingredient = ingredients.query.get(new_ingredient.ingredients_id)
#         assert retrieved_ingredient.ingredients_name == "Sample Ingredient"
#         assert retrieved_ingredient.ingredients_type == "Vegetable"
#         assert retrieved_ingredient.ingredients_qty == 10.0

#         # Update
#         retrieved_ingredient.ingredients_qty = 12.0
#         db.session.commit()
#         updated_ingredient = ingredients.query.get(new_ingredient.ingredients_id)
#         assert updated_ingredient.ingredients_qty == 12.0

#         # Delete
#         db.session.delete(updated_ingredient)
#         db.session.commit()
#         assert ingredients.query.get(new_ingredient.ingredients_id) is None



# def test_invoice_crud_operations(client):
#     app = create_app()

#     with app.app_context():
#         # Create
#         new_invoice = Invoice(
#             date_time=datetime.utcnow(),
#             total_price=100.0,
#             queue_num=1,
#             invoice_status="Pending"
#         )
#         db.session.add(new_invoice)
#         db.session.commit()

#         # Confirm it's added by checking its ID
#         assert new_invoice.invoice_id is not None

#         # Read
#         retrieved_invoice = Invoice.query.get(new_invoice.invoice_id)
#         assert retrieved_invoice.total_price == 100.0
#         assert retrieved_invoice.invoice_status == "Pending"

#         # Update
#         retrieved_invoice.total_price = 110.0
#         db.session.commit()
#         updated_invoice = Invoice.query.get(new_invoice.invoice_id)
#         assert updated_invoice.total_price == 110.0

#         # Delete
#         db.session.delete(updated_invoice)
#         db.session.commit()
#         assert Invoice.query.get(new_invoice.invoice_id) is None


# def test_special_comments_crud_operations(client):
#     app = create_app()

#     with app.app_context():
#         sample_dish = dishes(dish_name="Sample Dish", price=10.0)
#         db.session.add(sample_dish)
#         # Create
#         comment = special_comments(special_comments="Special Comment", special_comments_price=5.0, dish_id=1)
#         db.session.add(comment)
#         db.session.commit()

#         # Check if it's added
#         assert comment.special_comments_id is not None

#         # Read
#         retrieved_comment = special_comments.query.get(comment.special_comments_id)
#         assert retrieved_comment.special_comments == "Special Comment"

#         # Update
#         retrieved_comment.special_comments_price = 6.0
#         db.session.commit()
#         updated_comment = special_comments.query.get(comment.special_comments_id)
#         assert updated_comment.special_comments_price == 6.0

#         # Delete
#         db.session.delete(updated_comment)
#         db.session.commit()
#         assert special_comments.query.get(comment.special_comments_id) is None


# # def test_transactions_crud_operations(client):
# #     # Assuming you have a Dish and Invoice model already populated with some data.
# #     # For simplicity, let's say you've added a dish with dish_id=1 and an invoice with invoice_id=1

# #     app = create_app()

# #     with app.app_context():
# #                # Creating a sample dish and invoice for the test. You might need to adjust this based on your actual Dish and Invoice model structure.
# #         sample_dish = dishes(dish_name="Sample Dish", price=10.0)  # add necessary fields for your Dish model
# #         sample_invoice = Invoice(date_time=datetime.utcnow(),
# #             total_price=100.0,
# #             queue_num=1,
# #             invoice_status="Pending")  # add necessary fields for your Invoice model

# #         db.session.add(sample_dish)
# #         db.session.add(sample_invoice)
# #         db.session.commit()

# #         # Now, let's use the IDs of the created dish and invoice.
# #         dish_id = sample_dish.dish_id
# #         invoice_id = sample_invoice.invoice_id

# #         # Create
# #         new_transaction = Transactions(dish_id=dish_id, invoice_id=invoice_id, quantity=5, with_special_comments=True)
# #         db.session.add(new_transaction)
# #         db.session.commit()
# #         # Create
# #         new_transaction = Transactions(dish_id=1, invoice_id=1, quantity=5, with_special_comments=True)
# #         db.session.add(new_transaction)
# #         db.session.commit()

# #         # Confirm it's added by checking its ID
# #         added_transaction = Transactions.query.filter_by(dish_id=1, invoice_id=1).first()
# #         assert added_transaction is not None
# #         assert added_transaction.quantity == 5
# #         assert added_transaction.with_special_comments == True

# #         # Update
# #         added_transaction.quantity = 3
# #         added_transaction.with_special_comments = False
# #         db.session.commit()

# #         updated_transaction = Transactions.query.filter_by(dish_id=1, invoice_id=1).first()
# #         assert updated_transaction.quantity == 3
# #         assert updated_transaction.with_special_comments == False

# #         # Delete
# #         db.session.delete(updated_transaction)
# #         db.session.commit()

# #         assert Transactions.query.filter_by(dish_id=1, invoice_id=1).first() is None



# def test_ingredient_routes(client):
#     app = create_app()

#     with app.app_context():
#         # Test add_ingredient
#         response = client.post('/api/ingredient/addIngredients', json={
#             'ingredients_name': 'Test Ingredient',
#             'ingredients_type': 'Type1',
#             'ingredients_qty': 5
#         })
#         assert response.status_code == 200
#         assert response.json['result'] == 'Ingredient added successfully'

#         added_ingredient = ingredients.query.filter_by(ingredients_name='Test Ingredient').first()
#         assert added_ingredient is not None

#         # Test get_all_ingredients
#         response = client.get('/api/ingredient/getAllIngredients')
#         assert response.status_code == 200
#         assert any(ing['ingredients_name'] == 'Test Ingredient' for ing in response.json)

#         # Test update_ingredient
#         response = client.put(f'/api/ingredient/updateIngredient/{added_ingredient.ingredients_id}', json={
#             'ingredients_name': 'Updated Ingredient',
#             'ingredients_type': 'Type2',
#             'ingredients_qty': 10
#         })
#         assert response.status_code == 200
#         assert response.json['result'] == 'Ingredient updated successfully'

#         updated_ingredient = ingredients.query.get(added_ingredient.ingredients_id)
#         assert updated_ingredient.ingredients_name == 'Updated Ingredient'

#         # Test delete_ingredient
#         # Since there's a dependency check on the recipes and dishes table, 
#         # for simplicity, let's assume there's no such dependency for the test ingredient.
#         response = client.delete(f'/api/ingredient/deleteIngredient/{updated_ingredient.ingredients_id}')
#         assert response.status_code == 200
#         assert response.json['result'] == 'Ingredient deleted successfully'
#         assert ingredients.query.get(updated_ingredient.ingredients_id) is None