from flask import Flask 
from flask_cors import CORS

from .extensions import db, migrate
from .routes.order import main
from .routes.user import user

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:accesstech@accesstech.cuyv9atug6pr.us-east-1.rds.amazonaws.com:5432/postgres'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(main)
    app.register_blueprint(user)

    return app