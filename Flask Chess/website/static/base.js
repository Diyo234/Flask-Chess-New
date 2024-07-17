var number = "2"
var dot_squares = []
var borderSize = "calc(var(--square-size)/30)"
var whiteTime = document.getElementById('white-time')
// whiteTime.textContent = 600
var blackTime = document.getElementById('black-time')
// blackTime.textContent = 600
timeList = [whiteTime, blackTime]
clockPause = [0,0]
var score = 0
var turn = 0
var player = players[0]
var removeButtons = 4
var oneTimeListener = 0
var kingBlackSquare = false
var pieceList = [
  ['queen_white', 'knight_white', 'rook_white', 'bishop_white'],
  ['queen_black', 'knight_black', 'rook_black', 'bishop_black']
]
if (choice == 'online' || choice == 'opponent'){
  url = urlForOnline
} else if (choice == 'player' || choice == 'computer'){
  url = urlForOffline
}
loadScript(url)
if (choice == 'computer'){
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
        display.setAttribute('clock-value' , timer);
        if (--timer < 0) {
            clearInterval(intervalID)
            timer = 0;
            console.log(display)
            if (display.id == 'white-time'){
                opponentPieces = document.querySelectorAll(".piece[data-colour = 'chess.BLACK']")
                var king = ["king_white", "king_black"]
            }
            else{
                opponentPieces = document.querySelectorAll(".piece[data-colour = 'chess.WHITE']")
                var king = ["king_black", "king_white"]
            }
            console.log(opponentPieces)
            var total = 0
            opponentPieces.forEach(element => {
                console.log(element)
                console.log(parseInt(element.dataset.value, 10))
                total += parseInt(element.dataset.value, 10)
            });
            total = Math.abs(total)
            console.log(total)
            if (total == 0){
                stalemate()
            } else if (total == 3){
                pawnPresent = false
                opponentPieces.forEach(element => {
                    if (element.dataset.type == 'chess.PAWN'){
                        pawnPresent = true
                    }
                });
                if (pawnPresent == false){
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
    return(intervalID)
  }
}
function moveAction(data){
  if (turn > 0 ){
    previousLoc.style.border = "none"
    newLoc.style.border = "none"
  }
  var redSquare = chessboard.querySelectorAll(`.chess-square[style*="border: ${borderSize} solid red;"]`);
  if (redSquare[0]){
    redSquare[0].style.border = "none"
  }
  updateUI(data);
  turn += 1
  currentPlayer = turn % 2
  pausedPlayer = 1 - turn % 2
  timer = timeList[currentPlayer]
  clearInterval(clockPause [pausedPlayer])
  clockPause[currentPlayer] = startTimer (timer.getAttribute('clock-value'),timer)
  player = players[currentPlayer]
  newLoc = document.querySelector(`.chess-square[data-coordinates="${data.xValue},${data.yValue}"]`)
  previousLoc = document.querySelector(`.chess-square[data-coordinates="${data.coords}"]`)
  if (kingBlackSquare == true){
    kingBlackSquare = false
    kings = document.querySelectorAll(`.piece[data-type="chess.KING"]`)
    kings.forEach(element => {
      if (element.parentNode.style.border == `${borderSize} solid black`){
        element.parentNode.style.border = "none"
      }
    });
  }
  newLoc.style.border = `${borderSize} solid black`
  previousLoc.style.border = `${borderSize} solid black`
  
}

function castlingAction(data){
    data[1] += data[0]/2
  const rook = document.querySelectorAll(`.piece[data-coordinates="${data[1]},${data[2]}"][data-type="chess.ROOK"]`);
  data[1] -= data[0];
  if (data[0] == -4){
    data[1] -= 1
  }
  rook[0].setAttribute('data-coordinates', `${data[1]},${data[2]}`);
  var rookSquare = document.querySelector(`.chess-square[data-coordinates="${data[1]},${data[2]}"]`);
  rookSquare.appendChild(rook[0]);
}
function promotionAction(data){
  const parts = data[0].split('_')
  const promotedPawn = document.querySelector(`.piece[data-coordinates="${data[1]},${data[2]}"]`);
  promotedPawn.src = `/static/images/${data[0]}.png`;
  promotedPawn.alt = data.enPassant;
  promotedPawn.setAttribute('data-piece', `${data[0]}`)
  promotedPawn.setAttribute('data-type', `chess.${parts[0].toUpperCase()}`)
  if (parts[0] == 'queen'){
    newValue = 9
  } else if (parts[0] == 'rook'){
    newValue = 5
  }else{
    newValue = 3
  }
  promotedPawn.setAttribute('data-value', newValue*parseInt(promotedPawn.dataset.value, 10))
  score -= parseInt(promotedPawn.dataset.value, 10)
  updateScore()
}
function checkmateAction(data){
    losingKing = document.querySelector(`.piece[alt="${data[0]}"]`)
    losingKing.parentNode.style.backgroundColor = "red"
    winningKing = document.querySelector(`.piece[alt="${data[1]}"]`)
    winningKing.parentNode.style.backgroundColor = "green"
    turn += 0.2
}
function stalemateAction(data){
    whiteKing = document.querySelector(`.piece[alt="king_white"]`)
  blackKing = document.querySelector(`.piece[alt="king_black"]`)
  whiteKing.parentNode.style.backgroundColor = "yellow"
  blackKing.parentNode.style.backgroundColor = "yellow"
  turn += 0.2
}
function repetitionAction(data){
    whiteKing = document.querySelector(`.piece[alt="king_white"]`)
  blackKing = document.querySelector(`.piece[alt="king_black"]`)
  whiteKing.parentNode.style.backgroundColor = "yellow"
  blackKing.parentNode.style.backgroundColor = "yellow"
  turn += 0.2
}
//////
function kingAction(data){
  king = document.querySelector(`.piece[alt="${data[0]}"]`)
  king.parentNode.style.border = `${borderSize} solid red`
}
function updateTakenSquare(piece){
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
      if (takenPiece.type == "chess.PAWN"){
        takenSquare.insertBefore(square, takenSquare.children[0] || null)
      }else if (takenPiece.type == "chess.KNIGHT"){
        if (takenSquare.children[0]?.firstChild?.type !== "chess.PAWN"){
          takenSquare.insertBefore(square, takenSquare.children[0] || null)
        }else{
          takenSquare.insertBefore(square, takenSquare.children[1] || null)
        }
      }else if (takenPiece.type == "chess.BISHOP"){
        if((takenSquare.children[0]?.firstChild?.type !== "chess.PAWN") && (takenSquare.children[0]?.firstChild?.type != "chess.KNIGHT")){
          takenSquare.insertBefore(square, takenSquare.children[0] || null)
        }else if(takenSquare.children[1]?.firstChild?.type != "chess.KNIGHT"){
          takenSquare.insertBefore(square, takenSquare.children[1] || null)
        }else{
          takenSquare.insertBefore(square, takenSquare.children[2] || null)
        }
      }else {
        let elementsInsideTakenSquare = takenSquare.querySelectorAll('.container');
        position = takenSquare.firstChild
        for (let i = 0; i < elementsInsideTakenSquare.length; i++) {
          let item = elementsInsideTakenSquare[i];
          if (item.firstChild?.classList == "resize" ){
            position = item
            if (item.firstChild?.type == "chess.QUEEN"){
              break
            }
          } else{
            position = item
            break
          }
        
      }
      takenSquare.insertBefore(square,position || null)
      }
  } else{
    isPresent.number += 1
    multiplier = takenSquare.querySelector(`img[src="${piece.src}"]`)
    multiplier.number+=1
    multiplier.textContent = `X${multiplier.number}`
    const newText = document.createElement('div');
    newText.textContent = multiplier.textContent
    newText.style.position = "absolute";
    newText.style.top = "0";
    newText.style.right = "0";
    newText.id = "text"
    textSquare = document.getElementById(piece.dataset.value)
    if (multiplier.number > 2){
      oldText = textSquare.querySelector("#text")
      textSquare.removeChild(oldText)

    }
    textSquare.appendChild(newText)

  }
}
function enPassantAction(data){
    deletionSquare = document.querySelector(`.chess-square[data-coordinates="${data[0]},${data[1]}"]`);
    while (deletionSquare.firstChild) {
      piece = deletionSquare.firstChild
      deletionSquare.removeChild(piece);
      if (piece.classList == 'piece'){
        score += parseInt(piece.dataset.value, 10)
        updateScore()
        if (piece.dataset.colour == 'chess.WHITE'){
          takenSquare = document.getElementById('white-taken')
        } else if (piece.dataset.colour == 'chess.BLACK'){
          takenSquare = document.getElementById('black-taken')
        }
        updateTakenSquare(piece)
      }
    }
  
}
function updateScore(){
  oldScore = document.querySelector('#score')
  if (oldScore){
    oldScore.parentNode.removeChild(oldScore)
  }
  if (score < 0){
    const newScore = document.createElement('div');
    newScore.textContent = `+${score * (-1)}`
    newScore.style.fontSize = "3vh"
    newScore.id = "score"
    document.getElementById('black-taken').lastElementChild.appendChild(newScore)
  } else if (score > 0){
    const newScore = document.createElement('div');
    newScore.textContent = `+${score }`
    newScore.style.fontSize = "3vh"
    newScore.id = "score"
    document.getElementById('white-taken').lastElementChild.appendChild(newScore)
  }
}
function updateUI(data){
  lastClicked = document.querySelector(`.piece[data-coordinates="${data.coords}"]`);
  if (lastClicked) {
    lastClicked.setAttribute('data-coordinates', `${data.xValue},${data.yValue}`)
    const destinationSquare = document.querySelector(`.chess-square[data-coordinates="${data.xValue},${data.yValue}"]`);
  while (destinationSquare.firstChild) {
    piece = destinationSquare.firstChild
    destinationSquare.removeChild(piece);
    if (piece.classList == 'piece'){
      score += parseInt(piece.dataset.value, 10)
      updateScore()
      if (piece.dataset.colour == 'chess.WHITE'){
        takenSquare = document.getElementById('white-taken')
      } else if (piece.dataset.colour == 'chess.BLACK'){
        takenSquare = document.getElementById('black-taken')
      }
      updateTakenSquare(piece)
    }

  }
    destinationSquare.appendChild(lastClicked);
  } else {
    console.error('Element not found:', data.coords);
        }
}
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

function botMove(){
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
      oneTimeListener = createEventListener([""], ...botData, botPromote)
      oneTimeListener()
      
    })
  }
function buttonClick(piece, xValue, yValue){
    Element = [piece, xValue, yValue]
    oneTimeListener = createEventListener(Element)
    document.addEventListener('click', oneTimeListener)
  }
  if (player == "computer"){
    botMove()
  }
document.addEventListener('click', function(event) {
  removeButtons += 1
  
  var dots = chessboard.getElementsByClassName('dot');
  Array.from(dots).forEach(function (item) {
    item.parentNode.removeChild(item);
});
  var blueSquares = chessboard.querySelector(`.chess-square[style*="border: ${borderSize} solid blue;"]`)
  if(blueSquares){
    
  blueSquares.style.border = "none"
  }
  var buttons = chessboard.querySelectorAll('button');
  if (buttons && removeButtons == 3) {
    removeButtons = 4
    turn = turn + 0.1
    updateVariable(turn)
    buttons.forEach(function(button) {
      button.parentNode.removeChild(button);
    });
}

});
  function createEventListener(Element, botX, botY, botPiece, botPromote) {
    return function() {
    if (typeof(Element[0]) == "string" || Element.classList?.contains('dot')) {
      if(Element.classList?.contains('dot')){
        var xValue = Element.dataset.x;
        var yValue = Element.dataset.y;
        xValue = parseInt(xValue, 10);
        yValue = parseInt(yValue, 10);
        Element.remove()
        var promote = false
        if (lastClicked.getAttribute('data-piece') === 'pawn_white' && lastClicked.getAttribute('data-coordinates').endsWith(1) || 
        lastClicked.getAttribute('data-piece') === 'pawn_black' && lastClicked.getAttribute('data-coordinates').endsWith(6)) {
          if (lastClicked.getAttribute('data-piece') === 'pawn_white'){
            options = pieceList[0]
          } else{
            options = pieceList[1]
          }
          turn = turn - 0.1
          updateVariable(turn)
          for (i in options){
            const button = document.createElement('button')
            button.classList.add('button')
            button.type = 'button'
            yCoord = yValue + (i)*parseInt(lastClicked.dataset.value,10)
            var one = document.querySelector(`.chess-square[data-coordinates="${xValue},${yCoord}"]`);
            one.appendChild(button)
            buttonImage = document.createElement('img')
            buttonImage.src = urlDict[options[i]]
            buttonImage.classList.add('piece')
            button.newPiece = options[i]
            button.appendChild(buttonImage)
            button.addEventListener('click', function(){
              answer = buttonClick(button.newPiece, xValue, yValue)})
          }
          removeButtons = 1
          return
        
        } } else if (typeof(Element[0]) == "string" && botX == undefined) {
          document.removeEventListener('click', oneTimeListener)
          promote = Element[0]
          xValue = Element[1]
          yValue = Element[2]
    }else if (typeof(Element[0]) == "string"){
      // document.removeEventListener('click', oneTimeListener)
      promote = false
      xValue = botX
      yValue = botY
      lastClicked = botPiece
      coords = lastClicked.getAttribute('data-coordinates')
      
        
      if (botPromote){
        lastLetter = botPromote[botPromote.length - 1];
        if (lastClicked.getAttribute('data-piece') === 'pawn_white'){
          options = pieceList[0]
        } else{
          options = pieceList[1]
        }
        if (lastLetter == "q"){
          promote = options[0]
        } else if (lastLetter == "n"){
          promote = options[1]
        } else if (lastLetter == "r"){
          promote = options[2]
        } else if (lastLetter == "b"){
          promote = options[3]
        }
      }
    }
      const move = {
        oldCoordinates : lastClicked.getAttribute('data-coordinates'),
        newCoordinates: [xValue,yValue],
        promote:promote
      };
      moveData = {
        xValue:xValue, yValue:yValue, coords:coords}
        movePiece(moveData)
        fetch('/move_piece', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        
        body: JSON.stringify(move)
        })
        .then(response =>{
          if(!response.ok){
            console.log("error")
          }
          return(response.json())
        }) 
        .then(data => {
          if (data[0] == 1 || data[0] == -1){
            yValue += data[0]
            // updateVariable([xValue,yValue])
            enPassant([xValue,yValue])
          } else if (data[0] == 2 || data[0] == -4){
            castling([data[0],xValue,yValue])
          } else if (pieceList[0].includes(data[0]) || pieceList[1].includes(data[0])){
            promotion([data[0], xValue, yValue])
          }
          if (data[data.length-1] =='check' || data[data.length-1] == 'checkmate'){
            if (turn %2 == 0){
              var king = ["king_white", "king_black"]
            } else {
              var king = ["king_black", "king_white"]
            }
            if (data[data.length-1] =='check'){
              updateVariable(king)
              kingCheck(king)
            } else {
            checkmate(king)
            }
          } else if (data[data.length-1] =='stalemate') {
            stalemate(king)
          } else if (data[data.length-1] =='repetition') {
            repetition(king)
          }
          if (player == "computer"){
            botMove()
          }
        })
    } else if (Element.dataset.colour == "chess.WHITE" && turn %2 == 0 && (player_colour == "white" || choice == "player") || Element.dataset.colour == "chess.BLACK" && turn %2 == 1 && (player_colour == "black"|| choice == "player")){
        lastClicked = Element
          const jsonData = {
            coords: Element.getAttribute('data-coordinates')
          };
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
            lastClicked.parentNode.style.border = `${borderSize} solid blue`
            data.forEach(function(item){
              
              [x, y] = item.split(',').map(coord => parseInt(coord, 10));
              var dotElement = document.createElement('span');
              dotElement.classList.add('dot'); 
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
      
    }};
  }
};
start()