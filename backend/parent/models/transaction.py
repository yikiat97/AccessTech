from ..extensions import db

class Transactions(db.Model):
    __tablename__ = 'transactions'
    
    transaction_id = db.Column(db.Integer, primary_key=True)  # New primary key column
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.dish_id'))
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.invoice_id'))
    quantity = db.Column(db.Integer)
    with_special_comments = db.Column(db.Boolean)
    
    
    # Note: Removed the primary_key=True from dish_id and invoice_id since 'id' is the new primary key

