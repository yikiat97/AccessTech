from ..extensions import db

class TransactionSpecialComments(db.Model):
    __tablename__ = 'transaction_special_comments'
    dish_id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, primary_key=True)
    special_comments_id = db.Column(db.Integer, db.ForeignKey('special_comments.special_comments_id'), primary_key=True)
