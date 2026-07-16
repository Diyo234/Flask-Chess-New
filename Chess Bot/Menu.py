import tkinter as tk
class Menu:
    def __init__(self):
        self.choice = None
        self.root = tk.Tk()
        self.label = tk.Label(self.root, text = "Hello")
        self.label.pack(padx = 500, pady = 200)
        self.button1 = tk.Button(self.root, text = "Player vs Player", command = self.game)
        self.button1.pack(padx = 10)
        self.button2 = tk.Button(self.root, text = "Player vs Computer", command = self.game2)
        self.button2.pack(padx = 10)
        self.button3 = tk.Button(self.root, text = "Computer vs Computer", command = self.game3)
        self.button3.pack(padx = 10)
        self.root.mainloop()
    def game(self):
        print("1")
        self.choice = "Player", "Player"
        self.root.destroy()
    def game2(self):
        print("2")
        self.choice = "Player" , "Computer"
        self.root.destroy()
    def game3(self):
        print("3")
        self.choice = "Computer", "Computer"
        self.root.destroy()
clicked = Menu()
choice = clicked.choice