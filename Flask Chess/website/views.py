from flask import Blueprint, render_template, request, flash, jsonify, session
from flask_login import current_user
from flask_socketio import SocketIO, join_room, send, emit
from . import db, socketio
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
    
@views.route('/move_generator', methods=['POST'])
def calculated_move():
    data = request.json
    coords = data.get("coords")
    result = move_generator(coords)

    return jsonify(result)


def move_generator(coords):
    chessboard.set_fen(session['chessboard'])
    altered_moves = []
    square = chess.parse_square(letters[int(coords[0])]+str(8-int(coords[2])))
    legal_moves = chessboard.legal_moves
    piece_moves = [move.uci() for move in legal_moves if move.from_square == square]
    for move in piece_moves:
        x = str(letters.index(move[2]))
        y = str(8-int(move[3]))
        altered_moves.append(x+","+y)
    return(altered_moves)

@views.route('/move_piece', methods=['POST'])
def move(move = None):
    chessboard.set_fen(session['chessboard'])
    state = []
    if move == None:
        data = json.loads(request.data)
        old_coords = data.get('oldCoordinates')
        new_coords = data.get('newCoordinates')
        promote = data.get('promote')
        string_one = letters[int(old_coords[0])]
        string_two = str(8 - int(old_coords[-1]))
        string_three = letters[new_coords[0]]
        string_four = str(8 - new_coords[-1])
        move = string_one+string_two+string_three+string_four
        if promote != False:
            if promote == 'knight_black' or promote == 'knight_white':
                move += 'n'
            else:
                move += promote[0]
            state.append(promote)
    print(move)
    if chessboard.is_en_passant(chess.Move.from_uci(move)):
        if chessboard.turn == chess.BLACK:
            state.append(-1)
        else:
            state.append(1)
    elif chessboard.is_queenside_castling(chess.Move.from_uci(move)):
        state.append(-4)
    elif chessboard.is_kingside_castling(chess.Move.from_uci(move)):
        state.append(2)
    chessboard.push_uci(move)
    if chessboard.is_check():
        if chessboard.is_checkmate():
            state.append('checkmate')
        else:
            state.append('check')
    elif chessboard.is_stalemate():
        state.append('stalemate')
    elif chessboard.is_repetition():
        state.append('repetition')
    print(chessboard)
    print(state)
    session['chessboard'] = chessboard.fen()
    return jsonify(state)
@socketio.on('move')
def move_piece(data):
    xValue, yValue, coords = data['xValue'], data['yValue'], data['coords']
    socketio.emit('moved', {'xValue': xValue, 'yValue': yValue, 'coords':coords})

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