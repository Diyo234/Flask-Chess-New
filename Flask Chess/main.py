from website import create_app, socketio
from flask_socketio import SocketIO

app = create_app()

if __name__ == "__main__":
    socketio.run(app, port=8000, debug=True)