from ..extensions import db

class OrderNumberStore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    current_order_number = db.Column(db.Integer, default=0)