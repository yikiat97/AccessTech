from ..extensions import db

class DiscountInvoice(db.Model):
    __tablename__ = 'discount_invoice'
    discount_id = db.Column(db.Integer, db.ForeignKey('discount.discount_id'), primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('invoice.invoice_id'), primary_key=True)

