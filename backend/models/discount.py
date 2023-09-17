from ..extensions import db

class Discount(db.Model):
    __tablename__ = 'discount'
    discount_id = db.Column(db.Integer, primary_key=True)
    discount_name = db.Column(db.String(50))
    code = db.Column(db.String(50))
    discount_status = db.Column(db.String(50))
    discount_percent = db.Column(db.Float)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
