import logging
from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    logging.basicConfig(level=logging.DEBUG)

    with app.app_context():
        from app import routes
        app.register_blueprint(routes.bp)
    return app

# Make sure to remove any other top-level code here

#new