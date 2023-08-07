from ..extensions import db
from .ingredient import ingredients
from .dish import dishes

class recipes(db.Model):
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.dish_id'), primary_key=True)
    ingredients_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredients_id'), primary_key=True)
    ingredient_qty_needed = db.Column(db.Float, nullable=False)
