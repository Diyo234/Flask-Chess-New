import platform
from pathlib import Path
from stockfish import Stockfish

def get_stockfish_path() -> str:
    system = platform.system()
    if system == "Windows":
        return str(Path(__file__).resolve().parents[1] / "chess-bot" / "stockfish-windows-x86-64-avx2" / "stockfish" / "stockfish-windows-x86-64-avx2.exe")
    elif system == "Linux":
        return "/usr/games/stockfish"  # wherever apt/apk puts it
    else:
        raise RuntimeError(f"Unsupported platform: {system}")

stockfish = Stockfish(path=get_stockfish_path())
STOCKFISH_PATH = get_stockfish_path()
stockfish = Stockfish(path=STOCKFISH_PATH)


def best_move(board):
    stockfish.set_fen_position(board)
    move = stockfish.get_best_move()
    return(move)