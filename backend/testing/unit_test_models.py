from ..parent.extensions import db
from unittest.mock import patch, Mock
import pytest

from flask import Flask 
from flask_cors import CORS
# from ..parent.extensions import socketio
from datetime import datetime, timedelta

from ..parent import create_app

from ..parent.extensions import db, migrate
from ..parent.routes.order import order
from ..parent.routes.user import user
from ..parent.routes.ingredient import ingredient_inventory
from ..parent.routes.transaction import transaction
from ..parent.routes.payment import payment
from ..parent.routes.discount import discount_blueprint

from ..parent.models.dish import dishes
from ..parent.models.discount import Discount
from ..parent.models.ingredient import ingredients
from ..parent.models.invoice import Invoice
from ..parent.models.special_comments import special_comments
from ..parent.models.transaction import Transactions

from dotenv import load_dotenv
import os

# load all environment variables
load_dotenv()

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()

    with app.test_client() as client:
        yield client
    
    with app.app_context():
        db.drop_all()
        db.session.remove()

def test_ingredients_model(client):
    # Arrange
    ingredient = ingredients(ingredients_name='Salt', ingredients_type='Spice', ingredients_qty=0.5)

    # Act
    db.session.add(ingredient)
    db.session.commit()
    retrieved_ingredient = ingredients.query.filter_by(ingredients_name='Salt').first()

    # Assert
    assert retrieved_ingredient is not None
    assert retrieved_ingredient.ingredients_name == 'Salt'
    assert retrieved_ingredient.ingredients_type == 'Spice'
    assert retrieved_ingredient.ingredients_qty == 0.5
