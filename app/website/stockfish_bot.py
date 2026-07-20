from pathlib import Path

from stockfish import Stockfish

STOCKFISH_PATH = Path(__file__).resolve().parents[1] / "chess-bot" / "stockfish-windows-x86-64-avx2" / "stockfish" / "stockfish-windows-x86-64-avx2.exe"
stockfish = Stockfish(path=str(STOCKFISH_PATH))

def best_move(board):
    stockfish.set_fen_position(board)
    move = stockfish.get_best_move()
    return(move)
    