from ..extensions import db

class dishes(db.Model):
    dish_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dish_name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String(100), nullable=True)
    small_desc = db.Column(db.String(50), nullable=True)
    description = db.Column(db.String(500), nullable=True)
    dish_type = db.Column(db.String(50), nullable=True)
    tag = db.Column(db.String(50), nullable=True)
    qty = db.Column(db.Integer, nullable=True)
    placement = db.Column(db.String(50), nullable=True)
