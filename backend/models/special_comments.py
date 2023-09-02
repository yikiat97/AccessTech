from ..extensions import db

class special_comments(db.Model):
    __tablename__ = 'special_comments'
    
    special_comments_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    special_comments = db.Column(db.String(500))
    special_comments_price = db.Column(db.Float, nullable=True)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.dish_id'))