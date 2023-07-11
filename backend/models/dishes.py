from ..extensions import db

class admin_user(db.Model):
    admin_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(120), nullable=False)