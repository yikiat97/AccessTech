from flask import Flask 
from flask_cors import CORS
from parent.extensions import socketio

from parent.extensions import db, migrate
from parent.routes.order import order
from parent.routes.user import user
from parent.routes.ingredient import ingredient_inventory
from parent.routes.transaction import transaction
from parent.routes.payment import payment
from parent.routes.discount import discount_blueprint


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

    app.register_blueprint(order)
    app.register_blueprint(user)
    app.register_blueprint(ingredient_inventory)
    app.register_blueprint(transaction)
    app.register_blueprint(payment)
    app.register_blueprint(discount_blueprint)

    

    SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
    API_URL = '/static/swagger.json'  # Our API url (can of course be a local resource)




    socketio.init_app(app)

    
    return app
    
app = create_app()
if __name__ == '__main__':
    socketio.run(app,port=8080,debug=True)