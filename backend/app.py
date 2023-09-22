from flask import Flask 
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from parent.extensions import socketio

from parent.extensions import db, migrate
from parent.routes.order import order
from parent.routes.user import user
from parent.routes.ingredient import ingredient_inventory
from parent.routes.transaction import transaction
from parent.routes.payment import payment
from parent.routes.discount import discount_blueprint

from flask_sse import sse

from dotenv import load_dotenv
import os

# load all environment variables
load_dotenv()



def create_app():
    app = Flask(__name__)
    app.register_blueprint(sse, url_prefix='/sse')

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

# Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "Test application"
    },
    # oauth_config={  # OAuth config. See https://github.com/swagger-api/swagger-ui#oauth2-configuration .
    #    'clientId': "your-client-id",
    #    'clientSecret': "your-client-secret-if-required",
    #    'realm': "your-realms",
    #    'appName': "your-app-name",
    #    'scopeSeparator': " ",
    #    'additionalQueryStringParams': {'test': "hello"}
    # }
)

    app.register_blueprint(swaggerui_blueprint)


    socketio.init_app(app)

    
    return app
    
app = create_app()
if __name__ == '__main__':
    app.run(port=8080)