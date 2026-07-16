from stockfish import Stockfish
stockfish = Stockfish(path = "Chess Bot\\stockfish-windows-x86-64-avx2 (1)\\stockfish\\stockfish-windows-x86-64-avx2.exe")
print(stockfish)
print(stockfish.get_board_visual())
def best_move(board):
    print(stockfish)
    stockfish.set_fen_position(board)
    move = stockfish.get_best_move()
    return(move)
    