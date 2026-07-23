from flask import Blueprint, render_template, request, jsonify, session
from . import socketio
import json
from .stockfish_bot import*
import chess


rooms = 1
letters = "a", "b", "c", "d", "e", "f", "g", "h"

moves = Blueprint('moves', __name__)

@moves.route('/move_generator', methods=['POST'])
def calculated_move():
    pass


def move_generator(coords):
    pass

@moves.route('/move_piece', methods=['POST'])
def move(move = None):
    pass
@socketio.on('move')
def move_piece(data):
    pass
