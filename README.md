# Flask Chess

Flask Chess is a browser-based chess app built with Flask, Socket.IO, and python-chess. It supports online matchmaking, local player-vs-player games, and player-vs-computer play through the bundled Stockfish engine.

## What this project does

- Renders a full chessboard in the browser from a Flask app.
- Tracks board state in the session and validates moves with python-chess.
- Supports online play with Socket.IO room matching and game-state events.
- Supports offline play against Stockfish with selectable difficulty.
- Handles special chess rules such as castling, en passant, promotion, checkmate, stalemate, and repetition.
- Adapts the layout for desktop and mobile screens.

## Why it is useful

- Gives you a working multiplayer chess experience without a separate frontend framework.
- Uses a real chess engine for computer play instead of hardcoded moves.
- Keeps the game logic and UI in a small, easy-to-run Flask project.

## Getting started

### Requirements

- Python 3.10 or newer
- A Windows-compatible Stockfish executable at [Chess Bot/stockfish-windows-x86-64-avx2 (1)/stockfish/stockfish-windows-x86-64-avx2.exe](chess-bot/stockfish-windows-x86-64-avx2/stockfish/stockfish-windows-x86-64-avx2.exe)

### Install dependencies

From a fresh clone, create and activate a virtual environment, then install the pinned dependencies from `requirements.txt`:

In PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If you prefer `cmd.exe`, use:

```bat
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
```

If script execution is restricted in PowerShell, allow local scripts for the current user or use `cmd.exe` instead.

### Run the web app

Start the Flask app from the repository root:

```bash
python main.py
```

Then open `http://127.0.0.1:8000/` in your browser.

### What to expect on first run

- A SQLite database named `database.db` is created automatically the first time the app starts.
- The board opens at the home route and lets you choose online or offline play.
- Offline computer play uses the bundled Stockfish binary through [website/stockfish_bot.py](website/stockfish_bot.py).

### Usage examples

- Click **Play Online** to search for a Socket.IO match.
- Click **Play Offline** to choose player-vs-player or player-vs-computer.
- When playing the computer, choose a difficulty level before selecting your side.

### Notes for contributors

- Keep the Stockfish path in sync with [website/stockfish_bot.py](website/stockfish_bot.py) if you move the engine binary, or update it to a configurable setting before relocating the engine.
- The Flask secret key and database name are defined in [website/__init__.py](website/__init__.py).
- The board UI and game flow are split across [website/views.py](website/views.py), [website/static/](website/static/), and [website/templates/](website/templates/).

## Getting help

- Read the route and game logic in [website/views.py](website/views.py).
- Review the frontend behavior in [website/static/](website/static/) and the board template in [website/templates/home.html](website/templates/home.html).
- Refer to the bundled Stockfish documentation in [chess-bot/stockfish-windows-x86-64-avx2/stockfish/README.md](chess-bot/stockfish-windows-x86-64-avx2/stockfish/README.md) if you need engine-specific details.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for the full text.

## Maintenance and contributions

This repository does not currently include a dedicated maintainer or contribution guide. It appears to be maintained by the repository owner.

Contributions are welcome through pull requests. Please keep changes focused, describe the behavior you changed, and include reproduction steps for gameplay or networking bugs.

