from flask import Blueprint, render_template, request, jsonify, session
from flask_login import current_user
from flask_socketio import SocketIO, join_room, send, emit
from . import socketio
import json
from .stockfish_bot import*

import chess, random
rooms = 1
letters = "a", "b", "c", "d", "e", "f", "g", "h"

views = Blueprint('views', __name__)
@views.route('/', methods=['GET', 'POST'])
def home():
    global chessboard
    session['chessboard'] = chess.STARTING_FEN
    chessboard = chess.Board()
    return render_template("home.html", user=current_user)


@socketio.on('connect')
def connect():
    global rooms
    user_id = request.sid
    room = rooms
    print(room)
    join_room(user_id)
    name = session.get("name")
    join_room(room)
    clients_in_room = socketio.server.manager.rooms['/'][room]
    print(len(clients_in_room))
    print(f"Clients in room {room}: {clients_in_room}")
    if len(clients_in_room) == 2:
        rooms += 1
        colours = ["start_white","start_black"]
        index = random.randint(0,1)
        colour1 = colours.pop(index)
        colour2 = colours[0]
        for other_user_id in list(clients_in_room):
            if other_user_id == user_id:
                emit(colour1, room=other_user_id)
            else:
                emit(colour2, room=other_user_id)
@socketio.on('message')
def handle_message(data):
    socketio.send("big message")
    socketio.send(data)

@socketio.on('old variable')
def update_turn(data):
    if isinstance(data, list):
        if isinstance(data[0], int):
            print("this one now")
            socketio.emit('enPassant', data)
        else:
            socketio.send("king")
            socketio.emit('king', data)
    else:
        socketio.emit('new variable', data)

@socketio.on('checkmate')
def checkmate(data):
    socketio.emit('game over', data)
@socketio.on('stalemate')
def stalemate():
    socketio.emit('stalemated')
@socketio.on('repetition')
def draw_by_repetition():
    socketio.emit('draw by repetition')
@socketio.on('castling')
def castling(data):
    socketio.emit('castled', data)
@socketio.on('promotion')
def castling(data):
    socketio.emit('promoted', data)
@views.route('/handle_click', methods=['POST'])
def handle_click():
    piece = request.json['piece']
    response = {'message': f'Piece "{piece}" clicked'}
    return jsonify(response)
    

@views.route('/bot_move', methods=['POST'])
def bot_move():
    chessboard.set_fen(session['chessboard'])
    bot_move = best_move(chessboard.fen())
    x = str(letters.index(bot_move[0]))
    y = str(8-int(bot_move[1]))
    altered_moves = [(x+","+y)]
    x = str(letters.index(bot_move[2]))
    y = str(8-int(bot_move[3]))
    altered_moves.append ((x+","+y))
    print(bot_move)
    if len(bot_move) == 4:
        bot_move = 0
    altered_moves.append(bot_move)
    session['chessboard'] = chessboard.fen()
    return(altered_moves)

@views.route('/select_level', methods=['POST'])
def select_level():
    level = request.json
    stockfish.set_skill_level(int(level))
    return "Level set"