from flask import Flask, url_for
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from os import path
import functools
url_for = functools.partial(url_for, _scheme='https')

db = SQLAlchemy()
DB_NAME = "database.db"
socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['PREFERRED_URL_SCHEME'] = 'https'
    db.init_app(app)

    from .views import views, socketio

    app.register_blueprint(views, url_prefix='/')
    socketio.init_app(app)

    with app.app_context():
        if not path.exists(f'./{DB_NAME}'):
            db.create_all()

    return app



