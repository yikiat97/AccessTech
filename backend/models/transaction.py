from ..extensions import db

class Transactions(db.Model):
    __tablename__ = 'transactions'
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.dish_id'), primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.invoice_id'), primary_key=True)
    quantity = db.Column(db.Integer)
    with_special_comments = db.Column(db.Boolean)
