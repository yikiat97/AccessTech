from ..extensions import db

class ingredients(db.Model):
    ingredients_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ingredients_name = db.Column(db.String(50), nullable=False)
    ingredients_type = db.Column(db.String(50), nullable=False)
    ingredients_qty = db.Column(db.Float, nullable=False)

