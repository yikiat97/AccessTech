from ..extensions import db

class Invoice(db.Model):
    __tablename__ = 'invoice'
    invoice_id = db.Column(db.Integer, primary_key=True)
    date_time = db.Column(db.DateTime)
    total_price = db.Column(db.Float)
    queue_num = db.Column(db.Integer)
    invoice_status = db.Column(db.String(50))
    color = db.Column(db.String(50))
    order_number = db.Column(db.Integer)