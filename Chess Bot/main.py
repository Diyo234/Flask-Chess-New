import pygame; import time; import random; import chess; import copy
from pygame.locals import *
from pieces import * 
from Menu import choice
from stockfish_bot import*
print(choice)
player1 = choice[0]; player2 = choice[1]
turn = chess.WHITE
pygame.init()
RED = 255,0,0 ; GREEN = 0,255,150; BLUE = 0,0,255
display_info = pygame.display.Info()
WIDTH = display_info.current_w ; HEIGHT = display_info.current_h 
BLACK = 0,0,0; OFF_WHITE = 200,200,200; WHITE = 240,240,240; GREY =173, 200, 230
DARK_BROWN = 133, 94, 66; LIGHT_BROWN = 193, 173, 158; DARK_GREEN = 100,150,20
BOARD_WIDTH, BOARD_HEIGHT = (WIDTH*0.36)//1, (WIDTH*0.36)//1
ScreenSize = (WIDTH ,HEIGHT)
GameScreen = pygame.display.set_mode (ScreenSize)
width_offset =(WIDTH - BOARD_WIDTH)/2; height_offset = (HEIGHT - BOARD_HEIGHT)/2
square_size = BOARD_WIDTH/8
GameFont = pygame.font.Font (None,30); GameFont2 = pygame.font.Font (None,20); GameFont3 = pygame.font.Font (None,60)
letters = "a", "b", "c", "d", "e", "f", "g", "h"
radius = 10
GameScreen.fill(GREY)
while True:
    chessboard = chess.Board()
    position_list = []
    variables = []
    positions = {}
    square_dict = {}
    circles = []
    new_loc = []
    pieces = []
    moves = []
    captures = []
    en_passant = []
    short_castle = []
    long_castle = []
    deleted_locations = []
    number_list = []
    score = 0
    promotion = False
    white_check = False; black_check = False
    counter = 0
    taken_piece = None
    castled = None
    white_taken, black_taken = [], []
    redo_list = []
    class_dict = {
        Pawn_white: (width_offset, height_offset - 95), 
        Pawn_black: (width_offset  + 3/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35),
        Rook_white: (width_offset + 3/8 * BOARD_WIDTH, height_offset - 95),
        Rook_black: (width_offset  + 6/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35),
        Knight_white: (width_offset + 1/8 * BOARD_WIDTH, height_offset - 95),
        Knight_black: (width_offset  + 4/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35),
        Bishop_white: (width_offset + 2/8 * BOARD_WIDTH, height_offset - 95),
        Bishop_black: (width_offset  + 5/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35),
        Queen_white: (width_offset + 4/8 * BOARD_WIDTH, height_offset - 95),
        Queen_black: (width_offset  + 7/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35)
    }
    def get_key_from_value(dictionary, target_value):
        for key, value in dictionary.items():
            if value == target_value:
                return key
        return None
    def board(colour1, colour2, old_piece = None, new_piece = None, mover = None, old_loc = None, castled = None):
        global variables, counter, positions, white_check, black_check, taken_piece, white_taken, black_taken, score, position_list, chessboard, history, previous_chessboard
        print(chessboard)
        if counter == 0:
            pygame.draw.rect(GameScreen, (BLACK), pygame.Rect(width_offset-25, height_offset-25, BOARD_WIDTH+50, BOARD_HEIGHT+50))
        pygame.draw.rect(GameScreen, WHITE, pygame.Rect(width_offset  + 2/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35, BOARD_WIDTH * 6/8, 60))
        pygame.draw.rect(GameScreen, (BLACK), pygame.Rect(width_offset,height_offset - 95, BOARD_WIDTH * 6/8, 60))
        for x in white_taken:
            x.blit()
        for x in black_taken:
            x.blit()
        if taken_piece != None:
            if type(taken_piece) == int:
                score -= taken_piece
                taken_piece = None
            else:
                x,y = class_dict[type(taken_piece)]
                taken = type(taken_piece)(x,y)
                #taken_piece.change(x,y)
                #taken_piece.blit()
                score += taken_piece.value
                if taken_piece.colour == chess.WHITE:
                    white_taken.append(taken)
                    multiplier = 0
                    for n in white_taken:
                        if type(n) == type(taken_piece):
                            multiplier += 1
                            print(type(n))
                    if multiplier >= 2:
                        number = GameFont2.render (f"x{multiplier}",True, WHITE),(x,y)
                        if isinstance(taken_piece, Pawn_white):
                            number_list.append(number)
                            if multiplier > 2:
                                for n in number_list:
                                    print(n[1])
                                    print(number[1])
                                    if n[1] == number[1]:
                                        number_list.remove(n)
                        else:
                            number_list.append(number)
                else:
                    black_taken.append(taken)
                    multiplier = 0
                    for n in black_taken:
                        if type(n) == type(taken_piece):
                            multiplier += 1
                    if multiplier >= 2:
                        number = GameFont2.render (f"x{multiplier}",True, BLACK),(x,y)
                        if isinstance(taken_piece, Pawn_black):
                            number_list.insert(0, number)
                            if multiplier > 2:
                                number_list.pop(1)
                        else:
                            number_list.append(number)
            pygame.draw.rect(GameScreen, WHITE, pygame.Rect(width_offset  + 2/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35, 60, 60))
            pygame.draw.rect(GameScreen, (BLACK), pygame.Rect(width_offset + 5/8 * BOARD_WIDTH, height_offset - 95, 60, 60))
        for x in number_list:
            GameScreen.blit(*x)
        if score > 0:
            number = GameFont3.render (f"+{abs(score)}",True, WHITE),(width_offset + 5/8 * BOARD_WIDTH, height_offset - 95 + 15)
            GameScreen.blit(*number)
        elif score < 0:
            number = GameFont3.render (f"+{abs(score)}",True, (BLACK)),(width_offset + 2/8 * BOARD_WIDTH, BOARD_HEIGHT + height_offset + 35 + 15)
            GameScreen.blit(*number)
        for n in range (8):
            for x in range (8):
                if (n+1)%2 == 0:
                    if (x+1)%2 == 0:
                        square_colour = colour1
                    else:
                        square_colour = colour2
                else:
                    if (x+1)%2 == 0:
                        square_colour = colour2
                    else:
                        square_colour = colour1
                x_pos = (BOARD_WIDTH)*(x/8)+width_offset
                y_pos = (BOARD_WIDTH)*(n/8)+height_offset
                coords = letters[x] + str(8-n)
                square = Square(x_pos, y_pos, coords)
                square.blit(square_colour)
                if counter == 0:
                    positions[square.coords] = None
                    square_dict[square.coords] = [square.x, square.y]
                    x_coordinates = GameFont.render (letters[x],True, OFF_WHITE)
                    GameScreen.blit (x_coordinates, (x_pos+(square_size/2),BOARD_HEIGHT+height_offset))
                    GameScreen.blit (x_coordinates, (x_pos+(square_size/2),height_offset-20))
            if counter == 0:
                y_coordinates = GameFont.render (str(n+1),True, OFF_WHITE)
                y_pos2 = (BOARD_WIDTH)*(1-(n+1)/8)+height_offset+ (square_size/2 -20)
                GameScreen.blit (y_coordinates, (BOARD_WIDTH+10+width_offset, y_pos2))
                GameScreen.blit (y_coordinates, (width_offset-20, y_pos2))
        
        if counter == 1:
            for piece in pieces:
                piece.blit()
                if isinstance (piece, King_white) and white_check == True:
                    pygame.draw.rect(GameScreen, RED, (piece.x - (square_size/2-piece.width/2), 
                                                            piece.y - (square_size/2-piece.height/2), square_size, square_size), 2)
                elif isinstance (piece, King_black) and black_check == True:
                    pygame.draw.rect(GameScreen, RED, (piece.x - (square_size/2-piece.width/2), 
                                                            piece.y - (square_size/2-piece.height/2), square_size, square_size), 2)
        else:
            for x in range(8):
                pawn_white = Pawn_white((BOARD_WIDTH)*(x/8)+width_offset,(BOARD_WIDTH)*(6/8)+height_offset)
                pawn_black = Pawn_black((BOARD_WIDTH)*(x/8)+width_offset,(BOARD_WIDTH)*(1/8)+height_offset)
                pieces.extend ([pawn_white, pawn_black])
                positions[letters[x]+str(2)] = pawn_white
                positions[letters[x]+str(7)] = pawn_black
            for n in (width_offset,(BOARD_WIDTH)*(7/8)+width_offset): 
                rook_white = Rook_white(n,(BOARD_WIDTH)*(7/8)+height_offset)
                pieces.append(rook_white)
            positions["a1"] = pieces[-2]
            positions["h1"] = pieces [-1]
            for n in (width_offset,(BOARD_WIDTH)*(7/8)+width_offset): 
                rook_black = Rook_black(n,height_offset)
                pieces.append(rook_black)
            positions["a8"] = pieces[-2]
            positions["h8"] = pieces[-1]
            for n in ((BOARD_WIDTH)*(1/8)+width_offset,(BOARD_WIDTH)*(6/8)+width_offset): 
                knight_white = Knight_white(n,(BOARD_WIDTH)*(7/8)+height_offset)
                pieces.append(knight_white)
            positions["b1"] = pieces[-2]
            positions["g1"] = pieces[-1]
            for n in ((BOARD_WIDTH)*(1/8)+width_offset,(BOARD_WIDTH)*(6/8)+width_offset): 
                knight_black = Knight_black(n,height_offset)
                pieces.append(knight_black)
            positions["b8"] = pieces[-2]
            positions["g8"] = pieces[-1]
            for n in ((BOARD_WIDTH)*(2/8)+width_offset,(BOARD_WIDTH)*(5/8)+width_offset): 
                bishop_white = Bishop_white(n,(BOARD_WIDTH)*(7/8)+height_offset)
                pieces.append(bishop_white)
            positions["c1"] = pieces[-2]
            positions["f1"] = pieces[-1]
            for n in ((BOARD_WIDTH)*(2/8)+width_offset,(BOARD_WIDTH)*(5/8)+width_offset): 
                bishop_black = Bishop_black(n,height_offset)
                pieces.append(bishop_black)
            positions["c8"] = pieces[-2]
            positions["f8"] = pieces[-1]
            queen_white = Queen_white((BOARD_WIDTH)*(3/8)+width_offset,(BOARD_WIDTH)*(7/8)+height_offset)
            queen_black = Queen_black((BOARD_WIDTH)*(3/8)+width_offset,height_offset)
            king_white = King_white((BOARD_WIDTH)*(4/8)+width_offset,(BOARD_WIDTH)*(7/8)+height_offset)
            king_black = King_black((BOARD_WIDTH)*(4/8)+width_offset,height_offset)
            pieces.extend([queen_white, queen_black, king_white, king_black])
            positions["d1"] = queen_white; positions["d8"] = queen_black
            positions["e1"] = king_white; positions["e8"] = king_black
            counter = 1
            position_list.append(positions.copy())
        pygame.display.update()
        if chessboard.is_stalemate():
            print("Stalemate")
        if chessboard.can_claim_threefold_repetition():
            print("Draw by repetition")
        if chessboard.is_checkmate() and chessboard.turn == chess.WHITE:
            print("Checkmate")
            print("Black Wins!")
        elif chessboard.is_checkmate() and chessboard.turn == chess.BLACK:
            print("Checkmate")
            print("White Wins!")
        if old_piece != None:
            copied_piece = None
            if taken_piece != None:
                copied_piece = (type(taken_piece), taken_piece.old, taken_piece.value, taken_piece)
            
            variables.append((position_list[-1],copied_piece, white_taken.copy(), black_taken.copy(), score, history, old_piece, new_piece, mover, old_loc, number_list.copy(), castled))

        return(pieces)
                        
    result = board(LIGHT_BROWN, DARK_BROWN)
    running = True
    while running:    
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN or chessboard.turn != turn:
                taken_piece = None
                board(LIGHT_BROWN, DARK_BROWN)
                if chessboard.turn != turn or event.button == 1:
                    if chessboard.turn == turn:
                        for piece in result:
                            if piece.rect.collidepoint(event.pos) and chessboard.turn == piece.colour and chessboard.turn == turn:
                                circles.clear()
                                moves.clear()
                                new_loc.clear()
                                captures.clear()
                                en_passant.clear()
                                short_castle.clear()
                                long_castle.clear()
                                current_piece = piece
                                location = get_key_from_value(positions, piece)
                                square = chess.parse_square(location)
                                mover = chessboard.piece_at(square)
                                legal_moves = chessboard.legal_moves
                                piece_moves = [move.uci() for move in legal_moves if move.from_square == square]
                                for move in piece_moves:
                                    potential = square_dict[move[2:4]]
                                    moves.append(move)
                                    if chessboard.is_capture(chess.Move.from_uci(move)):
                                        circles.append(pygame.draw.circle(GameScreen, RED, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                        captures.append(pygame.draw.circle(GameScreen, RED, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                        if chessboard.is_en_passant(chess.Move.from_uci(move)):
                                            en_passant.append(pygame.draw.circle(GameScreen, RED, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                    else:
                                        circles.append(pygame.draw.circle(GameScreen, BLUE, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                        if (isinstance(piece, King_white) or isinstance (piece, King_black)) and (move == "e1g1" or move == "e8g8"):
                                            short_castle.append(pygame.draw.circle(GameScreen, BLUE, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                            king = piece
                                        elif (isinstance(piece, King_white) or isinstance (piece, King_black)) and (move == "e1c1" or move == "e8c8"):
                                            long_castle.append(pygame.draw.circle(GameScreen, BLUE, (potential[0]+square_size/2, potential[1]+ square_size/2), radius))
                                            king = piece
                                    if len(move) == 5 and move[4] == "q":
                                        promotion = True
                                        promote = move
                                        pawn = piece
                                    new_loc.append((potential[0], potential[1]))
                                pygame.draw.rect(GameScreen, BLUE, (piece.x - (square_size/2-piece.width/2), 
                                                                    piece.y - (square_size/2-piece.height/2), square_size, square_size), 2)
                                pygame.display.update()
                                break
                previous_chessboard = chessboard.copy()
                if chessboard.turn != turn:
                    bot_move = best_move(chessboard.fen())
                    current_piece = positions[bot_move[0:2]]
                    circles = [None]
                    potential = square_dict[bot_move[2:4]]
                    new_loc = [(potential[0], potential[1])]
                    moves = [bot_move]
                for circle in circles:
                    if circle == None or circle.collidepoint(event.pos):
                        position_list.append(positions.copy())
                        old_piece = current_piece.old
                        current_piece.change(*new_loc[circles.index(circle)])
                        new_piece_coords = current_piece.old
                        history = (chess.Board(chessboard.fen()))
                        print(best_move(chessboard.fen()))
                        print("above")
                        if promotion == True:
                            choice = input("Enter the promotion piece: ")
                            if chessboard.turn == chess.WHITE:
                                if choice == "r":
                                    promoted = Rook_white
                                elif choice == "b":
                                    promoted = Bishop_white
                                elif choice == "n":
                                    promoted = Knight_white
                                else:
                                    promoted = Queen_white
                                    choice = "q"
                            elif chessboard.turn == chess.BLACK:
                                if choice == "r":
                                    promoted = Rook_black
                                elif choice == "b":
                                    promoted = Bishop_black
                                elif choice == "n":
                                    promoted = Knight_black
                                else:
                                    promoted = Queen_black
                                    choice = "q"
                            new_piece = promoted(pawn.x-(square_size/2 - pawn.width/2), pawn.y-(square_size/2 - pawn.height/2))
                            (moves[circles.index(circle)]).replace("q", choice)
                            moves[circles.index(circle)]= (moves[circles.index(circle)]).replace("q", choice)
                            print((moves[circles.index(circle)]))
                            pieces.append(new_piece)
                            pieces.remove(pawn)
                            promotion = False
                            current_piece = new_piece
                        chessboard.push_uci(moves[circles.index(circle)])
                        print(moves[circles.index(circle)])
                        if positions[moves[circles.index(circle)][2:4]] != None:
                            taken_piece = positions[moves[circles.index(circle)][2:4]]
                            pieces.remove(taken_piece)
                        elif circle in en_passant and chessboard.turn == chess.BLACK:
                            taken_piece = positions[moves[circles.index(circle)][2]+ str (int(moves[circles.index(circle)][3])-1)] 
                            pieces.remove(taken_piece)
                        elif circle in en_passant and chessboard.turn == chess.WHITE:
                            taken_piece = positions[moves[circles.index(circle)][2]+ str (int(moves[circles.index(circle)][3])+1)]
                            pieces.remove(taken_piece)
                        else: 
                            taken_piece = None
                        if isinstance(taken_piece, Piece):
                            deleted_locations.append(moves[circles.index(circle)][2:4])
                        if circle in short_castle:
                            (positions["h" + moves[circles.index(circle)][3]]).change(king.x - square_size -(square_size/2 - king.width/2), king.y-(square_size/2 - king.height/2))
                            castled = ("h" + moves[circles.index(circle)][3], positions["h" + moves[circles.index(circle)][3]], positions["h" + moves[circles.index(circle)][3]].old)
                            positions["f" + moves[circles.index(circle)][3]] = positions["h" + moves[circles.index(circle)][3]]
                            positions["h" + moves[circles.index(circle)][3]] = None                                
                        elif circle in long_castle:
                            (positions["a" + moves[circles.index(circle)][3]]).change(king.x + square_size -(square_size/2 - king.width/2), king.y-(square_size/2 - king.height/2))
                            castled = ("a" + moves[circles.index(circle)][3], positions["a" + moves[circles.index(circle)][3]], positions["a" + moves[circles.index(circle)][3]].old)
                            positions["d" + moves[circles.index(circle)][3]] = positions["a" + moves[circles.index(circle)][3]]
                            positions["a" + moves[circles.index(circle)][3]] = None
                        else:
                            castled = None
                        if chessboard.is_check() and chessboard.turn == chess.WHITE:
                            white_check = True
                        else:
                            white_check = False
                        if chessboard.is_check() and chessboard.turn == chess.BLACK:
                            black_check = True
                        else:
                            black_check = False
                        positions[moves[circles.index(circle)][2:4]] = current_piece
                        location = moves[circles.index(circle)][2:4]
                        positions[moves[circles.index(circle)][0:2]] = None
                        old_loc = moves[circles.index(circle)][0:2]
                        result = board(LIGHT_BROWN, DARK_BROWN, old_piece, new_piece_coords, location, old_loc, castled)
                        circles.clear()
                        moves.clear()
                        new_loc.clear()
                        captures.clear()
                        en_passant.clear()
                        short_castle.clear()    
                        long_castle.clear()
                        break
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_z and pygame.key.get_mods() and pygame.KMOD_CTRL and chessboard.fen() != chess.STARTING_FEN:
                    print("undo")
                    position_copy = positions.copy()
                    result = board(LIGHT_BROWN, DARK_BROWN, old_piece, None, location, old_loc, castled)
                    history = chessboard
                    redo_list.append(list(variables.pop()))
                    positions, taken_piece, white_taken, black_taken, score, chessboard, old_piece, new_piece_coords, mover, old_loc, number_list, castled = variables.pop()
                    redo_list[-1][5] = history
                    redo_list[-1][7] = new_piece_coords
                    if chessboard.is_check() and chessboard.turn == chess.WHITE:
                        white_check = True
                    else:
                        white_check = False
                    if chessboard.is_check() and chessboard.turn == chess.BLACK:
                        black_check = True
                    else:
                        black_check = False
                    if taken_piece != None:
                        new = taken_piece[3]
                        pieces.append(taken_piece[3])
                        new.change(*taken_piece[1])
                        positions[deleted_locations.pop()] = new
                        taken_piece = taken_piece[2]
                    if castled != None:
                        if castled[0][0] == "a":
                            castled[1].change(castled[2][0] - 3 * square_size, castled[2][1])
                        elif castled[0][0] == "h":
                            castled[1].change(castled[2][0] + 2 * square_size, castled[2][1])
                        positions[castled[0]] = castled[1]    
                        castled = None
                    position_copy[mover].change(*old_piece)
                    positions[old_loc] = position_copy[mover]
                    result = board(LIGHT_BROWN, DARK_BROWN)
                # if event.key == pygame.K_r and pygame.key.get_mods() and pygame.KMOD_CTRL and redo_list != []:
                #     print("redo")
                #     position_copy = positions.copy()
                #     positions, taken_piece, white_taken, black_taken, score, chessboard, old_piece, new_piece_coords, mover, old_loc, number_list, castled = redo_list.pop()
                #     if chessboard.is_check() and chessboard.turn == chess.WHITE:
                #         white_check = True
                #     else:
                #         white_check = False
                #     if chessboard.is_check() and chessboard.turn == chess.BLACK:
                #         black_check = True
                #     else:
                #         black_check = False
                #     if taken_piece != None:
                #         new = taken_piece[3]
                #         pieces.append(taken_piece[3])
                #         new.change(*taken_piece[1])
                #         positions[deleted_locations.pop()] = new
                #         taken_piece = taken_piece[2]
                #     if castled != None:
                #         if castled[0][0] == "a":
                #             castled[1].change(castled[2][0] - 3 * square_size, castled[2][1])
                #         elif castled[0][0] == "h":
                #             castled[1].change(castled[2][0] + 2 * square_size, castled[2][1])
                #         positions[castled[0]] = castled[1]    
                #         castled = None
                #     position_copy[old_loc].change(*new_piece_coords)
                #     positions[mover] = position_copy[old_loc]
                #     print(chessboard)
                #     result = board(LIGHT_BROWN, DARK_BROWN)
                        