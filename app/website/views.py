from flask import Blueprint, render_template, request, jsonify, session
from flask_login import current_user
from flask_socketio import SocketIO, join_room, send, emit
from . import socketio
import json
from .stockfish_bot import*

import chess, random
rooms = 1
letters = "a", "b", "c", "d", "e", "f", "g", "h"
colours = {'chess.WHITE': chess.WHITE, 'chess.BLACK': chess.BLACK}

views = Blueprint('views', __name__)
@views.route('/', methods=['GET', 'POST'])
def home():
    session['chessboard'] = chess.STARTING_FEN
    session['chessboards'] = [chess.STARTING_FEN]
    session['moves'] = []
    session['premoves'] = []
    session['history_fens'] = []
    session['forked_moves'] = []
    session['game_over'] = False
    return render_template("home.html", user=current_user)


@socketio.on('connect')
def connect():
    global rooms
    user_id = request.sid
    room = rooms
    join_room(user_id)
    name = session.get("name")
    join_room(room)
    clients_in_room = socketio.server.manager.rooms['/'][room]
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
            socketio.emit('enPassant', data)
        else:
            socketio.send("king")
            socketio.emit('king', data)
    else:
        socketio.emit('new variable', data)


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
def promotion(data):
    socketio.emit('promoted', data)
@views.route('/handle_click', methods=['POST'])
def handle_click():
    piece = request.json['piece']
    response = {'message': f'Piece "{piece}" clicked'}
    return jsonify(response)

@views.route('/move_generator', methods=['POST'])
def calculated_move():
    chessboard = chess.Board()
    chessboard.set_fen(session['chessboard'])
    data = request.json
    coords = data.get("coords")
    coords = letters[int(coords[0])]+str(8-int(coords[2]))
    piece = data.get("piece")
    color = data.get("color")
    kingside_rook = data.get("kingsideRook")
    queenside_rook = data.get("queensideRook")
    viewing_move_history = data.get("viewingMoveHistory")
    if piece is None:
        return jsonify([])
    if (chessboard.turn == chess.WHITE and color == 'chess.WHITE') or (chessboard.turn == chess.BLACK and color == 'chess.BLACK') or viewing_move_history == True:
        result = move_generator(coords)
    elif (chessboard.turn == chess.BLACK and color == 'chess.WHITE') or (chessboard.turn == chess.WHITE and color == 'chess.BLACK'):
        result = premove_generator(coords, piece, color, kingside_rook, queenside_rook)

    return jsonify(result)


def move_generator(coords):
    history_fens = session.get('history_fens', [])
    if len(history_fens) > 0:
        fen = history_fens[-1]
    else:
        fen = session['chessboard']
    chessboard = chess.Board()
    chessboard.set_fen(fen)
    altered_moves = []
    square = chess.parse_square(coords)
    legal_moves = chessboard.legal_moves
    piece_moves = [move.uci() for move in legal_moves if move.from_square == square]
    for move in piece_moves:
        x = str(letters.index(move[2]))
        y = str(8-int(move[3]))
        altered_moves.append(x+","+y)
    return(altered_moves)
def premove_generator(coords, piece, color, kingside_rook, queenside_rook):
    chessboard = chess.Board()
    chessboard.set_fen(session['chessboard'])
    altered_moves = []
    piece_moves = []
    if piece == 'pawn_white':
        piece_moves.append(coords + coords [0] + str(int(coords[1])+1))
        if coords[0] != 'a':
            piece_moves.append(coords + letters[letters.index(coords[0])-1]+str(int(coords[1])+1))
        if coords[0] != 'h':
            piece_moves.append(coords + letters[letters.index(coords[0])+1]+str(int(coords[1])+1))
        if coords[1] == '2':
            piece_moves.append(coords + coords[0]+str(int(coords[1])+2))
    elif piece == 'pawn_black':
        piece_moves.append(coords + coords [0] + str(int(coords[1])-1))
        if coords[0] != 'a':
            piece_moves.append(coords + letters[letters.index(coords[0])-1]+str(int(coords[1])-1))
        if coords[0] != 'h':
            piece_moves.append(coords + letters[letters.index(coords[0])+1]+str(int(coords[1])-1))
        if coords[1] == '7':
            piece_moves.append(coords + coords[0]+str(int(coords[1])-2))
    elif piece[:6] == 'knight':
        knight_moves = [(2, 1), (2, -1), (-2, 1), (-2, -1), (1, 2), (1, -2), (-1, 2), (-1, -2)]
        for dx, dy in knight_moves:
            new_x = letters.index(coords[0]) + dx
            new_y = int(coords[1]) + dy
            if 0 <= new_x < 8 and 1 <= new_y <= 8:
                piece_moves.append(coords + letters[new_x] + str(new_y))
    elif piece[:6] == 'bishop':
        for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
            new_x = letters.index(coords[0]) + dx
            new_y = int(coords[1]) + dy
            while 0 <= new_x < 8 and 1 <= new_y <= 8:
                piece_moves.append(coords + letters[new_x] + str(new_y))
                new_x += dx
                new_y += dy
    elif piece[:4] == 'rook':
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            new_x = letters.index(coords[0]) + dx
            new_y = int(coords[1]) + dy
            while 0 <= new_x < 8 and 1 <= new_y <= 8:
                piece_moves.append(coords + letters[new_x] + str(new_y))
                new_x += dx
                new_y += dy
    elif piece[:5] == 'queen':
        for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1), (-1, 0), (1, 0), (0, -1), (0, 1)]:
            new_x = letters.index(coords[0]) + dx
            new_y = int(coords[1]) + dy
            while 0 <= new_x < 8 and 1 <= new_y <= 8:
                piece_moves.append(coords + letters[new_x] + str(new_y))
                new_x += dx
                new_y += dy
    elif piece[:4] == 'king':
        color = colours[color]
        for dx, dy in [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]:
            new_x = letters.index(coords[0]) + dx
            new_y = int(coords[1]) + dy
            if 0 <= new_x < 8 and 1 <= new_y <= 8:
                piece_moves.append(coords + letters[new_x] + str(new_y))
        if chessboard.has_kingside_castling_rights(color) and kingside_rook:
            piece_moves.append(coords + ('g1' if color == chess.WHITE else 'g8'))
        if chessboard.has_queenside_castling_rights(color) and queenside_rook:
            piece_moves.append(coords + ('c1' if color == chess.WHITE else 'c8'))
    else:
        return []

    for move in piece_moves:
            x = str(letters.index(move[2]))
            y = str(8-int(move[3]))
            altered_moves.append(x+","+y)
    return(altered_moves)

@views.route('/move_piece', methods=['POST'])
def move(move = None):
    chessboard = chess.Board()
    history_fens = session.get('history_fens', [])
    if len(history_fens) == 0:
        chessboard.set_fen(chess.STARTING_FEN)
        for previous_move in session['moves']:
            chessboard.push_uci(previous_move)
    else:
        fen = history_fens[-1]
        chessboard.set_fen(fen)
    state = {}
    if session['game_over'] == True:
        return jsonify({'error': 'Game is over'})
    if move == None:
        data = json.loads(request.data)
        if type(data) == str:
            if chessboard.turn == chess.WHITE:
                colour = 'white'
            else:
                colour = 'black'
            move = session['premoves'].pop(0)
            if len(move) == 5:
                if move[4] == 'n':
                    state['promoted_piece'] = 'knight_'+colour
                elif move[4] == 'q':
                    state['promoted_piece'] = 'queen_'+colour
                elif move[4] == 'r':
                    state['promoted_piece'] = 'rook_'+colour
                elif move[4] == 'b':
                    state['promoted_piece'] = 'bishop_'+colour

        else:
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
                state['promoted_piece'] = promote
    if chessboard.is_en_passant(chess.Move.from_uci(move)):
        if chessboard.turn == chess.BLACK:
            state['en_passant'] = -1
        else:
            state['en_passant'] = 1
    elif chessboard.is_queenside_castling(chess.Move.from_uci(move)):
        state['castling'] = -4
    elif chessboard.is_kingside_castling(chess.Move.from_uci(move)):
        state['castling'] = 2
    
    move_object = chess.Move.from_uci(move)
    if move_object not in chessboard.legal_moves:
        print('illegal move')
        print(move)
        session['premoves'] = []

        return jsonify({'error': 'Illegal move'})
    chessboard.push_uci(move)
    if len(history_fens) == 0:
        session['chessboards'].append(chessboard.fen())
        print('added')
        session['moves'].append(move)
    else:
        session['history_fens'].append(chessboard.fen())
        session['forked_moves'].append(move)
        print('history')
    state['move'] = move
    print('legal move')
    print(move)
    session['chessboard'] = chessboard.fen()
    if chessboard.is_check():
        if chessboard.is_checkmate():
            state['game_status'] = 'checkmate'
        else:
            state['game_status'] = 'check'
            print('check')
    elif chessboard.is_stalemate():
        state['game_status'] = 'stalemate'
    elif chessboard.is_repetition(count=3):
        state['game_status'] = 'repetition'
        session['game_over'] = True
    elif chessboard.is_fifty_moves(): 
        state['game_status'] = 'fifty_moves'
        session['game_over'] = True
    elif chessboard.is_insufficient_material() and session['forked_moves'] == []:
        state['game_status'] = 'insufficient_material'
        session['game_over'] = True
    state['turn'] = chessboard.turn
    return jsonify(state)

@views.route('/store_move', methods=['POST'])
def store_move():
    data = json.loads(request.data)
    move = data.get('move')
    old_coords = move.get('oldCoordinates')
    new_coords = move.get('newCoordinates')
    promote = move.get('promote')
    piece = data.get('piece')
    string_one = letters[int(old_coords[0])]
    string_two = str(8 - int(old_coords[-1]))
    string_three = letters[new_coords[0]]
    string_four = str(8 - new_coords[-1])
    move = string_one+string_two+string_three+string_four
    if promote != False:
        data['promotion'] = promote
        if promote == 'knight_black' or promote == 'knight_white':
            move += 'n'
        else:
            move += promote[0]
    elif move == 'e1g1' and piece == 'king_white' or move == 'e8g8' and piece == 'king_black':
        data['castling'] = 2
    elif move == 'e1c1' and piece == 'king_white' or move == 'e8c8' and piece == 'king_black':
        data['castling'] = -4
    premoves = session.get('premoves', [])
    premoves.append(move)
    session['premoves'] = premoves
    session.modified = True
    return jsonify(data)

@views.route('/pop_premove', methods=['POST'])
def pop_premove():
    premoves = session.get('premoves', [])
    if premoves:
        popped_move = premoves.pop()
        session['premoves'] = premoves
        session.modified = True
        return jsonify({'popped_move': popped_move})
    else:
        return jsonify({'error': 'No premoves to pop'}), 400

@views.route('/move_history', methods=['POST'])
def move_history():
    data = json.loads(request.data)
    move_entry_turn = int(data.get('moveEntryTurn'))
    current_turn = int(data.get('currentTurn'))
    fen = session['chessboards'][move_entry_turn + 1]
    if (move_entry_turn + 1) == current_turn:
        session['history_fens'] = []
    else: 
        session['history_fens'] = [fen]
    if move_entry_turn == -1:
        move = None
    
    else:

        move = session['moves'][move_entry_turn]
        session['forked_moves'].append(move)
    chessboard = chess.Board()
    chessboard.set_fen(fen)
    session['chessboard'] = fen
    game_status = None
    if chessboard.is_check():
        if chessboard.is_checkmate():
            game_status = 'checkmate'
        else:
            game_status = 'check'
    if chessboard.is_stalemate():
        game_status = 'stalemate'
    return jsonify({'move': move, 'chessboard': str(chessboard), 'game_status': game_status, 'turn': chessboard.turn})

@views.route('/view_next_move', methods=['POST'])
def view_next_move():
    data = json.loads(request.data)
    move_entry_turn = int(data.get('moveEntryTurn'))
    session['history_fens'] = []
    move = session['moves'][move_entry_turn]
    session['forked_moves'].append(move)
    fen = session['chessboards'][move_entry_turn + 1]
    chessboard = chess.Board()
    chessboard.set_fen(fen)
    session['chessboard'] = fen
    game_status = None
    if chessboard.is_check():
        if chessboard.is_checkmate():
            game_status = 'checkmate'
        else:
            game_status = 'check'
    if chessboard.is_stalemate():
        game_status = 'stalemate'
    return jsonify({'move': move, 'chessboard': str(chessboard), 'game_status': game_status, 'turn': chessboard.turn})

@views.route('/undo_forked_move', methods=['POST'])
def undo_forked_move():
    if len(session['history_fens']) > 0:
        session['history_fens'].pop()
    if len(session['history_fens']) == 0:
        return jsonify({'move': None, 'chessboard': None, 'forked': False})
    
    fen = session['history_fens'][-1] if session['history_fens'] else chess.STARTING_FEN
    session['forked_moves'].pop()
    move = session['forked_moves'][-1] if session['forked_moves'] else None
    chessboard = chess.Board()
    chessboard.set_fen(fen)
    session['chessboard'] = fen
    game_status = None
    if chessboard.is_check():
        game_status = 'check'
    return jsonify({'move': move, 'chessboard': str(chessboard), 'forked': True, 'game_status': game_status, 'turn': chessboard.turn})


@socketio.on('move')
def move_piece(data):
    xValue, yValue, coords = data['xValue'], data['yValue'], data['coords']
    socketio.emit('moved', {'xValue': xValue, 'yValue': yValue, 'coords':coords})

@views.route('/bot_move', methods=['POST'])
def bot_move():
    chessboard = chess.Board()
    chessboard.set_fen(session['chessboard'])
    bot_move = best_move(chessboard.fen())
    x = str(letters.index(bot_move[0]))
    y = str(8-int(bot_move[1]))
    altered_moves = [(x+","+y)]
    x = str(letters.index(bot_move[2]))
    y = str(8-int(bot_move[3]))
    altered_moves.append ((x+","+y))
    if len(bot_move) == 4:
        bot_move = 0
    altered_moves.append(bot_move)
    # session['chessboard'] = chessboard.fen()
    return(altered_moves)

@views.route('/select_level', methods=['POST'])
def select_level():
    level = request.json
    stockfish.set_skill_level(int(level))
    return "Level set"