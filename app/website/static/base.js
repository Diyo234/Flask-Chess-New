var number = "2"
var dot_squares = []
var borderSize = "calc(var(--square-size)/30)"
var whiteTime = document.getElementById('white-time')
// whiteTime.textContent = 600
var blackTime = document.getElementById('black-time')
// blackTime.textContent = 600
timeList = [whiteTime, blackTime]
clockPause = [0, 0]
var score = 0
var turn = 0
var currentPlayer = turn % 2
var storedMoves = []
var premoveCaptures = []
var moveCompleted = false
var premoveCompleted = false
var viewingMoveHistory = false
var alternateLine = false
var player = players[0]
var removeButtons = 4
var oneTimeListener = 0
var kingBlackSquare = false
var pieceList = [
  ['queen_white', 'knight_white', 'rook_white', 'bishop_white'],
  ['queen_black', 'knight_black', 'rook_black', 'bishop_black']
]
var pieceDict = {
  'Q': ['queen_white', '9'], 'N': ['knight_white', '3'], 'R': ['rook_white', '5'], 'B': ['bishop_white', '3'],
  'q': ['queen_black', '-9'], 'n': ['knight_black', '-3'], 'r': ['rook_black', '-5'], 'b': ['bishop_black', '-3'],
  'K': ['king_white', '0'], 'k': ['king_black', '0'], 'P': ['pawn_white', '1'], 'p': ['pawn_black', '-1']
};
if (choice == 'online' || choice == 'opponent') {
  url = urlForOnline
} else if (choice == 'player' || choice == 'computer') {
  url = urlForOffline
  console.log(players)
}
loadScript(url)
// if (choice == 'computer'){
if (choice) {
  function startTimer() {
  }
}
else {
  function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var intervalID = setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;
      display.setAttribute('clock-value', timer);
      if (--timer < 0) {
        clearInterval(intervalID)
        timer = 0;
        if (display.id == 'white-time') {
          opponentPieces = document.querySelectorAll(".piece[data-colour = 'chess.BLACK']")
          var king = ["king_white", "king_black"]
        }
        else {
          opponentPieces = document.querySelectorAll(".piece[data-colour = 'chess.WHITE']")
          var king = ["king_black", "king_white"]
        }
        var total = 0
        opponentPieces.forEach(element => {
          total += parseInt(element.dataset.value, 10)
        });
        total = Math.abs(total)
        if (total == 0) {
          stalemate()
        } else if (total == 3) {
          pawnPresent = false
          opponentPieces.forEach(element => {
            if (element.dataset.type == 'chess.PAWN') {
              pawnPresent = true
            }
          });
          if (pawnPresent == false) {
            checkmate(king)
          } else {
            stalemate()
          }
        } else {
          checkmate(king)
        }
        return
      }
    }, 1000);
    return (intervalID)
  }
}
function moveAction(data, premove = false, premoveCapture = false) {
  if (turn > 0 && !premove) {
    blackSquares = document.querySelectorAll('.moved-black-border')
    blackSquares.forEach(square => {
      square.classList.remove('moved-black-border')
    })
  }
  var redSquare = chessboard.getElementsByClassName('check-red-border')[0];
  if (redSquare && !premove) {
    redSquare.classList.remove('check-red-border');
  }
  updateUI(data, premove, premoveCapture = false);
  // nextTurn()
  // turn += 1
  // currentPlayer = turn % 2
  // pausedPlayer = 1 - turn % 2
  // timer = timeList[currentPlayer]
  // clearInterval(clockPause [pausedPlayer])
  // clockPause[currentPlayer] = startTimer (timer.getAttribute('clock-value'),timer)
  // player = players[currentPlayer]
  newLoc = document.querySelector(`.chess-square[data-coordinates="${data.xValue},${data.yValue}"]`)
  previousLoc = document.querySelector(`.chess-square[data-coordinates="${data.coords}"]`)
  if (kingBlackSquare == true && !premove) {
    kingBlackSquare = false
    kings = document.querySelectorAll(`.piece[data-type="chess.KING"]`)
    kings.forEach(element => {
      if (element.parentNode.classList.contains('moved-black-border')) {
        element.parentNode.classList.remove('moved-black-border')
      }
    });
  }
  if (!premove) {
    newLoc.classList.add('moved-black-border')
    previousLoc.classList.add('moved-black-border')
  }

}

function castlingAction(data) {
  data[1] += data[0] / 2
  console.log(data[1])
  const rook = document.querySelector(`.piece[data-coordinates="${data[1]},${data[2]}"][data-type="chess.ROOK"]`);
  console.log(rook)
  console.log(data)

  data[1] -= data[0];
  if (data[0] == -4) {
    data[1] -= 1
  }
  rook.setAttribute('data-coordinates', `${data[1]},${data[2]}`);
  var rookSquare = document.querySelector(`.chess-square[data-coordinates="${data[1]},${data[2]}"]`);
  rookSquare.appendChild(rook);
}
function promotionAction(data, premove = false) {
  const parts = data[0].split('_')
  const promotedPawn = document.querySelector(`.piece[data-coordinates="${data[1]},${data[2]}"]`);
  promotedPawn.src = `/static/images/${data[0]}.png`;
  promotedPawn.setAttribute('data-piece', `${data[0]}`)
  promotedPawn.setAttribute('data-type', `chess.${parts[0].toUpperCase()}`)
  if (!premove && viewingMoveHistory == false) {

    promotedPawn.alt = data.enPassant;
    if (parts[0] == 'queen') {
      newValue = 9
    } else if (parts[0] == 'rook') {
      newValue = 5
    } else {
      newValue = 3
    }
    promotedPawn.setAttribute('data-value', newValue * parseInt(promotedPawn.dataset.value, 10))
    
    score -= parseInt(promotedPawn.dataset.value, 10)
    updateScore()
    
  }
}
function checkmateAction(data) {
  losingKing = document.querySelector(`.piece[alt="${data[0]}"]`)
  losingKing.parentNode.classList.add('losing-king')
  winningKing = document.querySelector(`.piece[alt="${data[1]}"]`)
  winningKing.parentNode.classList.add('winning-king')
  if (!viewingMoveHistory) {
    turn += 0.2
  }
}
function stalemateAction(data) {
  whiteKing = document.querySelector(`.piece[alt="king_white"]`)
  blackKing = document.querySelector(`.piece[alt="king_black"]`)
  whiteKing.parentNode.classList.add('drawing-king')
  blackKing.parentNode.classList.add('drawing-king')
  if (!viewingMoveHistory) {
    turn += 0.2
  }
}
function repetitionAction(data) {
  whiteKing = document.querySelector(`.piece[alt="king_white"]`)
  blackKing = document.querySelector(`.piece[alt="king_black"]`)
  whiteKing.parentNode.classList.add('drawing-king')
  blackKing.parentNode.classList.add('drawing-king')
  turn += 0.2
}

function reverseActionUI(index = false) {
  if (index !== false) {
    moveStorage = storedMoves[index]
  } else {

    moveStorage = storedMoves.pop()
  }

  oldCoordinates = moveStorage.move.oldCoordinates
  moveStorageReversed = Object.assign({}, moveStorage);
  moveStorageReversed.coords = `${moveStorage.xValue},${moveStorage.yValue}`
  premoveCapture = premoveCaptures.pop(0)
  console.log(premoveCaptures)
  console.log(premoveCaptures.length);
  if (premoveCapture) {
    if (moveStorage.castling == 2) {
      rookSquare = document.querySelector(`.chess-square[data-coordinates="${moveStorage.xValue + 1},${moveStorage.yValue}"]`);
      rookPiece = document.querySelector(`.piece[data-coordinates="${moveStorage.xValue - 1},${moveStorage.yValue}"][data-type="chess.ROOK"]`);
      rookPiece.setAttribute('data-coordinates', `${moveStorage.xValue + 1},${moveStorage.yValue}`)
      rookSquare.appendChild(rookPiece)
    } else if (moveStorage.castling == -4) {
      rookSquare = document.querySelector(`.chess-square[data-coordinates="${moveStorage.xValue - 2},${moveStorage.yValue}"]`);
      rookPiece = document.querySelector(`.piece[data-coordinates="${moveStorage.xValue + 1},${moveStorage.yValue}"][data-type="chess.ROOK"]`);
      rookPiece.setAttribute('data-coordinates', `${moveStorage.xValue - 2},${moveStorage.yValue}`)
      rookSquare.appendChild(rookPiece)
    }
    for (i = 0; i < premoveCapture.length; i++) {
      premoveCapturePiece = premoveCapture[i]
      if (premoveCapturePiece == 'pawn_white' || premoveCapturePiece == 'pawn_black') {
        console.log("pawn promotion")
        const promotedPawn = document.querySelector(`.piece[data-coordinates="${moveStorage.xValue},${moveStorage.yValue}"]`);
        promotedPawn.src = `/static/images/${premoveCapturePiece}.png`;
        promotedPawn.setAttribute('data-piece', `${premoveCapturePiece}`)
        promotedPawn.setAttribute('data-type', 'chess.PAWN')

      } else {

        destinationSquare = document.querySelector(`.chess-square[data-coordinates="${premoveCapturePiece.dataset.coordinates}"]`);
        destinationSquare.appendChild(premoveCapturePiece)
      }
    }
  }
  const [x, y] = oldCoordinates.split(',').map(coord => parseInt(coord, 10));
  moveStorageReversed.xValue = x
  moveStorageReversed.yValue = y
  movePiece(moveStorageReversed, premove = 'reversed', premoveCapture)
}
function reverseAction() {
  fetch('/pop_premove', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => {
      if (!response.ok) {
        console.log("error")
      }
      return (response.json())
    })
    .then(data => {
      reverseActionUI()



    })


}


//////
function kingAction(data) {
  king = document.querySelector(`.piece[alt="${data[0]}"]`)
  king.parentNode.classList.add('check-red-border')
}
function updateTakenSquare(piece) {
  let isPresent = Array.from(takenSquare.children).some(existingPiece => existingPiece.firstChild?.src === piece.src);
  if (!isPresent) {
    takenPiece = document.createElement('img');
    takenPiece.src = piece.src;
    takenPiece.value = piece.dataset.value
    takenPiece.number = 1
    takenPiece.classList.add('resize')
    takenPiece.style.height = resizeHeight
    takenPiece.type = piece.dataset.type
    square = takenSquare.children[4]
    square.id = piece.dataset.value;
    square.appendChild(takenPiece)
    if (takenPiece.type == "chess.PAWN") {
      takenSquare.insertBefore(square, takenSquare.children[0] || null)
    } else if (takenPiece.type == "chess.KNIGHT") {
      if (takenSquare.children[0]?.firstChild?.type !== "chess.PAWN") {
        takenSquare.insertBefore(square, takenSquare.children[0] || null)
      } else {
        takenSquare.insertBefore(square, takenSquare.children[1] || null)
      }
    } else if (takenPiece.type == "chess.BISHOP") {
      if ((takenSquare.children[0]?.firstChild?.type !== "chess.PAWN") && (takenSquare.children[0]?.firstChild?.type != "chess.KNIGHT")) {
        takenSquare.insertBefore(square, takenSquare.children[0] || null)
      } else if (takenSquare.children[1]?.firstChild?.type != "chess.KNIGHT") {
        takenSquare.insertBefore(square, takenSquare.children[1] || null)
      } else {
        takenSquare.insertBefore(square, takenSquare.children[2] || null)
      }
    } else {
      let elementsInsideTakenSquare = takenSquare.querySelectorAll('.container');
      position = takenSquare.firstChild
      for (let i = 0; i < elementsInsideTakenSquare.length; i++) {
        let item = elementsInsideTakenSquare[i];
        if (item.firstChild?.classList == "resize") {
          position = item
          if (item.firstChild?.type == "chess.QUEEN") {
            break
          }
        } else {
          position = item
          break
        }

      }
      takenSquare.insertBefore(square, position || null)
    }
  } else {
    isPresent.number += 1
    multiplier = takenSquare.querySelector(`img[src="${piece.src}"]`)
    multiplier.number += 1
    multiplier.textContent = `X${multiplier.number}`
    const newText = document.createElement('div');
    newText.textContent = multiplier.textContent
    newText.style.position = "absolute";
    newText.style.top = "0";
    newText.style.right = "0";
    newText.id = "text"
    textSquare = document.getElementById(piece.dataset.value)
    if (multiplier.number > 2) {
      oldText = textSquare.querySelector("#text")
      textSquare.removeChild(oldText)

    }
    textSquare.appendChild(newText)

  }
}
function enPassantAction(data) {
  deletionSquare = document.querySelector(`.chess-square[data-coordinates="${data[0]},${data[1]}"]`);
  while (deletionSquare.firstChild) {
    piece = deletionSquare.firstChild
    deletionSquare.removeChild(piece);
    if (piece.classList == 'piece' && viewingMoveHistory == false) {
      score += parseInt(piece.dataset.value, 10)
      updateScore()
      if (piece.dataset.colour == 'chess.WHITE') {
        takenSquare = document.getElementById('white-taken')
      } else if (piece.dataset.colour == 'chess.BLACK') {
        takenSquare = document.getElementById('black-taken')
      }
      updateTakenSquare(piece)
    }
  }

}
function updateScore() {
  oldScore = document.querySelector('#score')
  if (oldScore) {
    oldScore.parentNode.removeChild(oldScore)
  }
  if (score < 0) {
    const newScore = document.createElement('div');
    newScore.textContent = `+${score * (-1)}`
    newScore.style.fontSize = "3vh"
    newScore.id = "score"
    document.getElementById('black-taken').lastElementChild.appendChild(newScore)
  } else if (score > 0) {
    const newScore = document.createElement('div');
    newScore.textContent = `+${score}`
    newScore.style.fontSize = "3vh"
    newScore.id = "score"
    document.getElementById('white-taken').lastElementChild.appendChild(newScore)
  }
}
function updateUI(data, premove = false, premoveCapture = false) {
  lastClicked = document.querySelector(`.piece[data-coordinates="${data.coords}"]`);
  if (!lastClicked) {
    lastClicked = document.querySelector(`.piece[data-coordinates="${data.xValue},${data.yValue}"]`);

  }
  if (lastClicked) {
    lastClicked.setAttribute('data-coordinates', `${data.xValue},${data.yValue}`)
    const destinationSquare = document.querySelector(`.chess-square[data-coordinates="${data.xValue},${data.yValue}"]`);
    if (data[castling] == 2 || data[castling] == -4) {
      capturedDuringPremove = []
      oldX = parseInt(data.coords.split(',')[0], 10)
      oldY = parseInt(data.coords.split(',')[1], 10)
      if (data[castling] == 2) {
        for (i = 0; i < 3; i++) {
          occupiedSquare = document.querySelector(`.chess-square[data-coordinates="${oldX + i},${oldY}"]`);

          while (occupiedSquare.firstChild) {
            if (occupiedSquare.firstChild.dataset?.type == "chess.KING") {
              kingSquare = occupiedSquare
              kingPiece = occupiedSquare.firstChild
            } else if (occupiedSquare.firstChild.classList?.contains('piece')) {
              capturedDuringPremove.push(occupiedSquare.firstChild)
            }
            occupiedSquare.removeChild(occupiedSquare.firstChild);
          }
        }
      } else if (data[castling] == -4) {
        for (i = 0; i < 4; i++) {
          occupiedSquare = document.querySelector(`.chess-square[data-coordinates="${oldX - i},${oldY}"]`);
          while (occupiedSquare.firstChild) {
            if (occupiedSquare.firstChild.dataset?.type == "chess.KING") {
              kingSquare = occupiedSquare
              kingPiece = occupiedSquare.firstChild
            } else if (occupiedSquare.firstChild.classList?.contains('piece')) {
              capturedDuringPremove.push(occupiedSquare.firstChild)
            }
            occupiedSquare.removeChild(occupiedSquare.firstChild);


          }

        }
      }
      kingSquare.appendChild(kingPiece)
      castling([data[castling], data.xValue, data.yValue])

    }
    else {

      capturedDuringPremove = false
      while (destinationSquare.firstChild) {
        piece = destinationSquare.firstChild
        destinationSquare.removeChild(piece);
        if (!premove && (piece.classList == 'piece' && viewingMoveHistory == false)) {
          score += parseInt(piece.dataset.value, 10)
          updateScore()
          if (piece.dataset.colour == 'chess.WHITE') {
            takenSquare = document.getElementById('white-taken')
          } else if (piece.dataset.colour == 'chess.BLACK') {
            takenSquare = document.getElementById('black-taken')
          }
          updateTakenSquare(piece)
        }
        else if (premove == 'premove') {
          if (piece.classList?.contains('piece')) {
            capturedDuringPremove = [piece]
          }
        }

      }

    }


    destinationSquare.appendChild(lastClicked);
    if (data[promotion]) {
      promotion([data[promotion], data.xValue, data.yValue], premove = 'premove')
      capturedDuringPremove.push(data.piece)
    }

    if (premove == 'premove') {
      premoveCaptures.push(capturedDuringPremove)

    }
  } else {
    console.error('Element not found:', data.coords);
  }
  if (premoveCapture) {
    destinationSquare = document.querySelector(`.chess-square[data-coordinates="${premoveCapture}]`);


    const promotedPawn = document.querySelector(`.piece[data-coordinates="${data[1]},${data[2]}"]`);
    promotedPawn.src = `/static/images/${data[0]}.png`;
    promotedPawn.alt = data[0];
    promotedPawn.setAttribute('data-piece', `${data[0]}`)
    promotedPawn.setAttribute('data-type', `chess.${parts[0].toUpperCase()}`)
  }
}
// function nextTurn(){
//   turn += 1
//   console.log("turn: " + turn)
//   currentPlayer = turn % 2
//   // if (currentPlayer == 1){
//   //   premoveWhite = false
//   // }
//   // else {
//   //   premoveWhite = true
//   // }
//   console.log("current player: " + currentPlayer)
//   pausedPlayer = 1 - turn % 2
//   timer = timeList[currentPlayer]
//   clearInterval(clockPause [pausedPlayer])
//   clockPause[currentPlayer] = startTimer (timer.getAttribute('clock-value'),timer)
//   player = players[currentPlayer]
// }
function start() {
  var clickedElement = document.getElementsByClassName('piece');
  var urlDict = {}
  for (var i = 0; i < clickedElement.length; i++) {
    var Element = clickedElement[i];
    piece = Element.dataset.piece
    urlDict[Element.dataset.piece] = Element.src
    if (Element) {
      Element.addEventListener('click', createEventListener(Element));
    }
  }
  document.addEventListener('keydown', function (event) {
    if (event.key === ' ' && currentPlayer != chosen_player && premoveCompleted == false) {
      clearDots()
      for (var i = storedMoves.length - 1; i >= 0; i--) {
        reverseActionUI(i)
      }
      premoveCompleted = true
    }
    else if (event.key == 'Backspace' && currentPlayer != chosen_player && premoveCompleted == false) {
      if (storedMoves.length > 0) {
        reverseAction()
      }
    }
    else if (event.key == 'ArrowLeft') {
      fetch('/undo_forked_move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (!response.ok) {
            console.log("error")
          }
          return (response.json())
        })
        .then(data => {
          console.log(data)
          if (!data.forked) {
            console.log('not forked')
            currentEntrySelected = document.querySelector('.move-entry.move-entry-selected');
            if (currentEntrySelected) {
              currentTurn = parseInt(currentEntrySelected.dataset.turn, 10)
              if (currentTurn > 0) {
                previousEntry = document.querySelector(`.move-entry[data-turn="${currentTurn - 1}"]`);
                if (previousEntry) {
                  moveHistory(previousEntry);
                }
              }
              else {
                moveHistory();
              }
            }
          }
          else {
            console.log('forked')

            chessboardStr = data.chessboard
            chessboardMove = data.move
            gameStatus = data.game_status
            historyTurn = data.turn
            clearBoard()
            resetBoard(chessboardStr, chessboardMove, gameStatus, historyTurn)
          }

        })



    }
    else if (event.key == 'ArrowRight' && viewingMoveHistory == true) {
      currentEntrySelected = document.querySelector('.move-entry.move-entry-selected');
      if (currentEntrySelected) {
        moveEntryTurn = parseInt(currentEntrySelected.dataset.turn, 10)
        nextEntry = document.querySelector(`.move-entry[data-turn="${moveEntryTurn + 1}"]`);
      }
      else {
        nextEntry = document.querySelector(`.move-entry[data-turn="0"]`);
      }

      if (nextEntry) {
        fetch('/view_next_move', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            moveEntryTurn: moveEntryTurn + 1
          })
        })
          .then(response => {
            if (!response.ok) {
              console.log("error")
            }
            return response.json()
          })
          .then(data => {
            console.log(data)
            chessboardStr = data.chessboard
            chessboardMove = data.move
            gameStatus = data.game_status
            historyTurn = data.turn
            clearBoard()
            resetBoard(chessboardStr, chessboardMove, gameStatus, historyTurn)
            currentEntrySelected = document.querySelector('.move-entry.move-entry-selected');
            if (currentEntrySelected) {
              currentEntrySelected.classList.remove('move-entry-selected');
            }
            nextEntry.classList.add('move-entry-selected');
            if (nextEntry.dataset.turn == turn - 1) {
              viewingMoveHistory = false
            }
          })
      }
    }

  });

  function clearBoard() {
    var squares = chessboard.getElementsByClassName('chess-square');
    for (var i = 0; i < squares.length; i++) {
      var square = squares[i];
      while (square.firstChild) {
        square.removeChild(square.firstChild);
      }
      if (square.classList.contains('moved-black-border')) {
        square.classList.remove('moved-black-border');
      }
      if (square.classList.contains('check-red-border')) {
        square.classList.remove('check-red-border');
      }
      if (square.classList.contains('losing-king')) {
        square.classList.remove('losing-king');
      }
      if (square.classList.contains('winning-king')) {
        square.classList.remove('winning-king');
      }
      if (square.classList.contains('drawing-king')) {
        square.classList.remove('drawing-king');
      }
    }
  }
  function replacePiece(piece, x, y) {
    pieceName = pieceDict[piece][0]
    pieceValue = pieceDict[piece][1]
    const square = document.querySelector(`.chess-square[data-coordinates="${x},${y}"]`);
    const newPiece = document.createElement('img');

    newPiece.src = `/static/images/${pieceName}.png`;
    newPiece.alt = pieceName;
    newPiece.classList.add('piece');
    newPiece.setAttribute('data-coordinates', `${x},${y}`);
    newPiece.setAttribute('data-piece', pieceName);
    newPiece.setAttribute('data-type', `chess.${pieceName.split('_')[0].toUpperCase()}`);
    newPiece.setAttribute('data-colour', `chess.${pieceName.split('_')[1].toUpperCase() === 'WHITE' ? 'WHITE' : 'BLACK'}`);
    newPiece.setAttribute('data-value', pieceValue);
    newPiece.addEventListener('click', createEventListener(newPiece));
    square.appendChild(newPiece);
  }

  function resetBoard(chessboardStr, chessboardMove, gameStatus, historyTurn) {
    var rows = chessboardStr.split('\n');

    for (var i = 0; i < rows.length; i++) {
      var squares = rows[i].trim().split(/\s+/);
      for (var j = 0; j < squares.length; j++) {
        var piece = squares[j];

        if (piece !== '.') {
          replacePiece(piece, j, i)
        }
      }
    }
    if (chessboardMove) {
      previousSquareId = chessboardMove.substring(0, 2);
      squareId = chessboardMove.substring(2, 4);
      previousSquare = document.getElementById(previousSquareId);
      square = document.getElementById(squareId);
      if (previousSquare && square) {
        previousSquare.classList.add('moved-black-border');
        square.classList.add('moved-black-border');
      }
    }

    if (historyTurn) {
      var king = ["king_white", "king_black"]
    } else {
      var king = ["king_black", "king_white"]
    }

    if (gameStatus == 'check') {
      updateVariable(king)
      kingCheck(king)
    } if (gameStatus == 'checkmate') {
      checkmate(king)
    }
    if (gameStatus == 'stalemate') {
      stalemate(king)
    }
  }
  function moveHistory(moveEntry = false) {

    currentEntrySelected = document.querySelector('.move-entry.move-entry-selected');
    if (currentEntrySelected) {
      currentEntrySelected.classList.remove('move-entry-selected');
    }
    viewingMoveHistory = true
    if (moveEntry) {
      moveEntry.classList.add('move-entry-selected');
      moveEntryTurn = moveEntry.dataset.turn
      moveEntryTurn = parseInt(moveEntryTurn, 10)
      if ((moveEntryTurn + 1) == turn) {
        viewingMoveHistory = false
      }
    }
    else {
      moveEntryTurn = -1
    }
    fetch('/move_history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moveEntryTurn: moveEntryTurn, currentTurn: turn })
    })
      .then(response => {
        if (!response.ok) {
          console.log("error")
        }
        return (response.json())
      })
      .then(data => {
        console.log(data)
        chessboardStr = data.chessboard
        chessboardMove = data.move
        gameStatus = data.game_status
        historyTurn = data.turn
        clearBoard()
        resetBoard(chessboardStr, chessboardMove, gameStatus, historyTurn)

      })
  }
  function botMove() {
    fetch('/bot_move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        botPromote = data.pop()
        botData = botMoveUpdate(data)
        oneTimeListener = createEventListener([""], ...botData, botPromote, undefined)
        oneTimeListener()

      })
  }
  function nextTurn(move) {
    currentEntrySelected = document.querySelector('.move-entry.move-entry-selected');
    if (currentEntrySelected) {
      currentEntrySelected.classList.remove('move-entry-selected');
    }
    if (currentPlayer == 0) {
      moveColumn = document.getElementById('move-column-white')
    }
    else {
      moveColumn = document.getElementById('move-column-black')
    }
    moveEntry = document.createElement('div')
    moveEntry.classList.add('move-entry')
    moveEntry.classList.add('move-entry-selected')
    moveEntry.dataset.turn = turn
    turn += 1

    moveEntryTurn = Math.floor((turn + 1) / 2)
    moveEntry.textContent = move
    moveEntry.onclick = function () {
      moveHistory(this);
    };
    moveColumn.appendChild(moveEntry)
    currentPlayer = turn % 2
    if (currentPlayer != chosen_player && storedMoves.length == 0) {
      premoveCompleted = false
    }
    pausedPlayer = 1 - turn % 2
    timer = timeList[currentPlayer]
    clearInterval(clockPause[pausedPlayer])
    clockPause[currentPlayer] = startTimer(timer.getAttribute('clock-value'), timer)
    player = players[currentPlayer]
    if ((storedMoves.length > 0) && (turn % 2 == chosen_player)) {
      premoveCompleted = true
      move = storedMoves.shift()
      oneTimeListener = createEventListener([""], "", "", "", "", move);
      oneTimeListener()
    }
  }

  function buttonClick(piece, xValue, yValue, promotionPremove) {
    Element = [piece, xValue, yValue, promotionPremove]
    oneTimeListener = createEventListener(Element)
    document.addEventListener('click', oneTimeListener)
  }
  if (player == "computer") {
    botMove()
  }
  function clearDots() {
    removeButtons += 1

    var dots = chessboard.getElementsByClassName('dot');
    Array.from(dots).forEach(function (item) {
      item.parentNode.removeChild(item);
    });
    var blueSquare = chessboard.getElementsByClassName('selected-blue-border')[0];
    if (blueSquare) {

      blueSquare.classList.remove('selected-blue-border');
    }
    var buttons = chessboard.querySelectorAll('button');
    if (buttons && removeButtons == 3) {
      removeButtons = 4
      turn = turn + 0.1
      updateVariable(turn)
      buttons.forEach(function (button) {
        button.parentNode.removeChild(button);
      });
    }


  }
  document.addEventListener('click', function (event) {
    clearDots()
  });
  function createEventListener(Element, botX, botY, botPiece, botPromote, moveStorage) {

    return function () {
      if (typeof (Element[0]) == "string" || Element.classList?.contains('dot')) {
        if (Element.classList?.contains('dot')) {
          var xValue = Element.dataset.x;
          var yValue = Element.dataset.y;
          xValue = parseInt(xValue, 10);
          yValue = parseInt(yValue, 10);
          Element.remove()
          var promote = false
          if (lastClicked.getAttribute('data-piece') === 'pawn_white' && lastClicked.getAttribute('data-coordinates').endsWith(1) ||
            lastClicked.getAttribute('data-piece') === 'pawn_black' && lastClicked.getAttribute('data-coordinates').endsWith(6)) {
            if (lastClicked.getAttribute('data-piece') === 'pawn_white') {
              options = pieceList[0]
            } else {
              options = pieceList[1]
            }
            turn = turn - 0.1
            updateVariable(turn)
            for (i in options) {
              const button = document.createElement('button')
              button.classList.add('button')
              button.type = 'button'
              yCoord = yValue + (i) * parseInt(lastClicked.dataset.value, 10)
              var one = document.querySelector(`.chess-square[data-coordinates="${xValue},${yCoord}"]`);
              one.appendChild(button)
              buttonImage = document.createElement('img')
              buttonImage.src = urlDict[options[i]]
              buttonImage.classList.add('piece')
              var promotionPremove = ''
              if (Element.classList?.contains('premove')) {
                promotionPremove = 'premove'
              }
              button.newPiece = options[i]
              button.appendChild(buttonImage)
              button.addEventListener('click', function () {
                answer = buttonClick(button.newPiece, xValue, yValue, promotionPremove)
              })
            }
            removeButtons = 1
            return

          }
        } else if (typeof (Element[0]) == "string" && botX == undefined && moveStorage == undefined) {
          document.removeEventListener('click', oneTimeListener)
          promote = Element[0]
          xValue = Element[1]
          yValue = Element[2]
        }
        else if (typeof (Element[0]) == "string" && moveStorage == undefined) {
          promote = false
          xValue = botX
          yValue = botY
          lastClicked = botPiece
          coords = lastClicked.getAttribute('data-coordinates')


          if (botPromote) {
            lastLetter = botPromote[botPromote.length - 1];
            if (lastClicked.getAttribute('data-piece') === 'pawn_white') {
              options = pieceList[0]
            } else {
              options = pieceList[1]
            }
            if (lastLetter == "q") {
              promote = options[0]
            } else if (lastLetter == "n") {
              promote = options[1]
            } else if (lastLetter == "r") {
              promote = options[2]
            } else if (lastLetter == "b") {
              promote = options[3]
            }
          }
        }
        if (moveStorage != undefined) {
          move = 'true'
          coords = moveStorage.coords
          promote = moveStorage.move?.promote
          xValue = moveStorage.xValue
          yValue = moveStorage.yValue
        } else {
          move = {
            oldCoordinates: lastClicked.getAttribute('data-coordinates'),
            newCoordinates: [xValue, yValue],
            promote: promote
          };
        }
        moveData = {
          xValue: xValue, yValue: yValue, coords: coords, move: move, piece: lastClicked.getAttribute('data-piece')
        }
        if ((!Element.classList?.contains('premove') && turn % 1 == 0 && Element[3] != 'premove')) {
          fetch('/move_piece', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify(move)
          })
            .then(response => {
              if (!response.ok) {
                console.log("error")
              }

              return (response.json())
            })
            .then(data => {
              if (data.error === "Illegal move") {
                console.log(data.error);
                storedMoves = []
              }
              else {

                movePiece(moveData)
                if (viewingMoveHistory == false) {
                  nextTurn(data.move)
                }
                if (data.en_passant == 1 || data.en_passant == -1) {
                  yValue += data.en_passant
                  // updateVariable([xValue,yValue])
                  enPassant([xValue, yValue])
                } else if (data.castling == 2 || data.castling == -4) {
                  castling([data.castling, xValue, yValue])
                } else if (data.promoted_piece) {
                  promotion([data.promoted_piece, xValue, yValue])
                }
                if (data.turn) {
                  var king = ["king_white", "king_black"]
                } else {
                  var king = ["king_black", "king_white"]
                }
                if (data.game_status == 'check' || data.game_status == 'checkmate') {

                  if (data.game_status == 'check') {
                    updateVariable(king)
                    kingCheck(king)
                  } else {
                    checkmate(king)
                  }
                } else if (data.game_status == 'stalemate') {
                  stalemate(king)
                } else if (data.game_status == 'repetition') {
                  repetition(king)
                  moveData = 0
                }
                if (player == "computer") {
                  botMove()
                }
              }

            })


        }
        else {
          fetch('/store_move', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(moveData)
          })
            .then(response => {
              if (!response.ok) {
                console.log("error")
              }
              return (response.json())
            })
            .then(data => {
              storedMoves.push(data)
              console.log(data)
              console.log(moveData)
              moveData[castling] = data.castling
              moveData[promotion] = data.promotion
              movePiece(moveData, premove = 'premove')
            })
        }

      }
      else if (chosen_player == 0 && turn % 1 == 0 && (
        Element.dataset.colour == 'chess.WHITE' && currentPlayer == 0 && storedMoves.length == 0 ||
        Element.dataset.colour == 'chess.WHITE' && currentPlayer == 1 && premoveCompleted == false ||
        Element.dataset.colour == 'chess.BLACK' && currentPlayer == 1 && premoveCompleted == true)
        || chosen_player == 1 && turn % 1 == 0 && (
          Element.dataset.colour == 'chess.BLACK' && currentPlayer == 1 && storedMoves.length == 0 ||
          Element.dataset.colour == 'chess.BLACK' && currentPlayer == 0 && premoveCompleted == false && turn > 0 ||
          Element.dataset.colour == 'chess.WHITE' && currentPlayer == 0 && premoveCompleted == true ||
          Element.dataset.colour == 'chess.WHITE' && turn == 0)
        || viewingMoveHistory == true && turn % 1 == 0
      ) {
        lastClicked = Element
        console.log(currentPlayer)
        console.log(chosen_player)
        if (chosen_player == 0 && currentPlayer == 1 &&
          document.querySelector('.piece[data-coordinates="4,7"][data-piece="king_white"]')) {
          kingsideRook = document.querySelector('.piece[data-coordinates="7,7"][data-piece="rook_white"]') !== null;
          queensideRook = document.querySelector(`.piece[data-coordinates="0,7"][data-piece="rook_white"]`) !== null;
        } else if (chosen_player == 1 && currentPlayer == 0 &&
          document.querySelector('.piece[data-coordinates="4,0"][data-piece="king_black"]') !== null) {
          kingsideRook = document.querySelector(`.piece[data-coordinates="7,0"][data-piece="rook_black"]`) !== null;
          queensideRook = document.querySelector(`.piece[data-coordinates="0,0"][data-piece="rook_black"]`) !== null;
        } else {
          kingsideRook = false;
          queensideRook = false;
        }
        const jsonData = {
          coords: Element.getAttribute('data-coordinates'),
          piece: Element.getAttribute('data-piece'),
          color: Element.getAttribute('data-colour'),
          kingsideRook: kingsideRook,
          queensideRook: queensideRook,
          viewingMoveHistory: viewingMoveHistory
        };
        console.log(jsonData)
        coords = jsonData.coords
        fetch('/move_generator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        })
          .then(response => response.json())
          .then(data => {
            lastClicked.parentNode.classList.add('selected-blue-border')
            var premove = 'none'
            var colour = 'none'
            if (viewingMoveHistory == true) {
              premove = 'none'
              colour = 'red'
            }
            else if (chosen_player == 0 && (
              Element.dataset.colour == 'chess.BLACK' && currentPlayer == 0 || Element.dataset.colour == 'chess.WHITE' && currentPlayer == 1) ||
              chosen_player == 1 && (
                Element.dataset.colour == 'chess.WHITE' && currentPlayer == 1 || Element.dataset.colour == 'chess.BLACK' && currentPlayer == 0)) {
              premove = "premove"
              colour = 'blue'
            }
            data.forEach(function (item) {

              [x, y] = item.split(',').map(coord => parseInt(coord, 10));
              var dotElement = document.createElement('span');
              if (Element.dataset.colour == 'chess.WHITE') {
                dotElement.classList.add('white-dots');
              }
              else {
                dotElement.classList.add('black-dots');
              }
              dotElement.classList.add('dot');
              dotElement.classList.add(premove);
              dotElement.style.backgroundColor = colour;
              dotElement.dataset.x = x;
              dotElement.dataset.y = y;
              const dotSquare = document.querySelector(`.chess-square[data-coordinates="${x},${y}"]`);
              dotSquare.appendChild(dotElement)
              dotElement.addEventListener('click', createEventListener(dotElement));
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });

      }
    };
  }
};
start()