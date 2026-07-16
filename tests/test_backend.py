import chess
import pytest

from website import create_app


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    app = create_app()
    app.config.update(TESTING=True)

    with app.test_client() as test_client:
        yield test_client


def test_home_route_initializes_board_session(client):
    response = client.get("/")

    assert response.status_code == 200
    assert b"Chessboard" in response.data

    with client.session_transaction() as session:
        assert session["chessboard"] == chess.STARTING_FEN


def test_move_generator_returns_pawn_moves(client):
    client.get("/")

    response = client.post("/move_generator", json={"coords": "4,6"})

    assert response.status_code == 200
    assert set(response.get_json()) == {"4,5", "4,4"}


def test_move_piece_updates_board_state(client):
    client.get("/")

    response = client.post(
        "/move_piece",
        json={
            "oldCoordinates": [4, 6],
            "newCoordinates": [4, 4],
            "promote": False,
        },
    )

    assert response.status_code == 200
    assert response.get_json() == []

    board = chess.Board()
    board.push_uci("e2e4")

    with client.session_transaction() as session:
        assert session["chessboard"] == board.fen()