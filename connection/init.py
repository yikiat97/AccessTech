from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://root:accesstech@accesstech.cuyv9atug6pr.us-east-1.rds.amazonaws.com:5432/postgres'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        from . import routes  # Import routes
        db.create_all()   # Create sql tables for our data models

        return app