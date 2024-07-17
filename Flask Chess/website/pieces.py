import pygame, chess
pygame.init()
display_info = pygame.display.Info()
WIDTH = display_info.current_w ; HEIGHT = display_info.current_h - 100
BOARD_WIDTH, BOARD_HEIGHT = (WIDTH*0.36)//1, (WIDTH*0.36)//1; ScreenSize = (WIDTH ,HEIGHT)
GameScreen = pygame.display.set_mode (ScreenSize)
width_offset =(WIDTH - BOARD_WIDTH)/2; height_offset = (HEIGHT - BOARD_HEIGHT)/2; square_size = BOARD_WIDTH/8
class Square:
    def __init__(self, x, y, coords):
        self.x = x
        self.y = y
        self.coords = coords
    def blit(self, square_colour):
        pygame.draw.rect(GameScreen, square_colour, pygame.Rect(self.x, self.y, square_size, square_size))
class Piece:
    def __init__(self, x, y, image_path):
        self.image = image_path
        self.load = pygame.image.load(self.image).convert_alpha()
        self.rect = self.load.get_rect(topleft=(x, y))
        self.width, self.height = self.load.get_size()
        self.x = x+(square_size/2 - self.width/2)
        self.y = y+(square_size/2 - self.height/2)
        self.old = self.x - (square_size/2 - self.width/2), self.y - (square_size/2 - self.height/2)
        GameScreen.blit(self.load, (self.x, self.y))
    def change(self,x,y):
        self.rect = self.load.get_rect(topleft=(x, y))
        self.x = x+(square_size/2 - self.width/2)
        self.y = y+(square_size/2 - self.height/2)
        self.old = self.x - (square_size/2 - self.width/2), self.y - (square_size/2 - self.height/2)
    def blit(self):
        GameScreen.blit(self.load, (self.x, self.y))
class Pawn_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\pawn_white.png"
        self.colour = chess.WHITE
        self.type = chess.PAWN
        self.value = 1
        super().__init__(x, y, image_path)
class Pawn_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\pawn_black.png"
        self.colour = chess.BLACK
        self.type = chess.PAWN
        self.value = -1
        super().__init__(x, y, image_path)
class Knight_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\knight_white.png"
        self.colour = chess.WHITE
        self.type = chess.KNIGHT
        self.value = 3
        super().__init__(x, y, image_path)
class Knight_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\knight_black.png"
        self.colour = chess.BLACK
        self.type = chess.KNIGHT
        self.value = -3
        super().__init__(x, y, image_path)
class Bishop_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\bishop_white.png"
        self.colour = chess.WHITE
        self.type = chess.BISHOP
        self.value = 3
        super().__init__(x, y, image_path)
class Bishop_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\bishop_black.png"
        self.colour = chess.BLACK
        self.type = chess.BISHOP
        self.value = -3
        super().__init__(x, y, image_path)
class Rook_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\rook_white.png"
        self.colour = chess.WHITE
        self.type = chess.ROOK
        self.value = 5
        super().__init__(x, y, image_path)
class Rook_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\rook_black.png"
        self.colour = chess.BLACK
        self.type = chess.ROOK
        self.value = -5
        super().__init__(x, y, image_path)
class Queen_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\queen_white.png"
        self.colour = chess.WHITE
        self.type = chess.QUEEN
        self.value = 9
        super().__init__(x, y, image_path)
class Queen_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\queen_black.png"
        self.colour = chess.BLACK
        self.type = chess.QUEEN
        self.value = -9
        super().__init__(x, y, image_path)
class King_white(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\king_white.png"
        self.colour = chess.WHITE
        self.type = chess.KING
        super().__init__(x, y, image_path)
class King_black(Piece):
    def __init__(self, x, y):
        image_path = "C:\\Users\\Latif\\Documents\\New Laptop\\Python\\Chess\\king_black.png"
        self.colour = chess.BLACK
        self.type = chess.KING
        super().__init__(x, y, image_path)