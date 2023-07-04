from flask import Flask 
from flask_cors import CORS

from .extensions import db, migrate
from .routes.order import main
from .routes.user import user

from dotenv import load_dotenv
import os

# load all environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(main)
    app.register_blueprint(user)

    return app