from flask import Blueprint

from ..extensions import db
from ..models.user import admin_user
# from ..models.video import Video

main = Blueprint('main', __name__)

@main.route('/user/<name>')
def create_user(name):
    user = admin_user(name=name)
    db.session.add(user)
    db.session.commit()

    return 'Created User!'