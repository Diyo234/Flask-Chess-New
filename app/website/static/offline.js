function enPassant(data){
    enPassantAction(data)
}
function kingCheck(data){
    kingAction(data)
}
function checkmate(data){
    checkmateAction(data)
}
function stalemate(data){
    console.log("stalemate")
    stalemateAction(data)
}
function repetition(){
    console.log("repetition")
    repetitionAction()
}
function movePiece(data, premove = false, premoveCapture = false){
        moveAction(data, premove, premoveCapture)
}
function castling(data){
    castlingAction(data)
}
function promotion(data, premove = false){
    promotionAction(data, premove)
}

function updateVariable(data){
}

// function botMove(){
//     fetch('/bot_move', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(response => response.json())
//     .then(data => {
//       botData = botMoveUpdate(data)
//       console.log(botData)
//       oneTimeListener = createEventListener([""], ...botData)
//       document.addEventListener('click', oneTimeListener)
      
//     })
// }
function botMoveUpdate(data){
    var holder = []
    data.forEach(function(item){
      
        [x, y] = item.split(',').map(coord => parseInt(coord, 10));
        holder.push([x,y])
      })
      botX = holder[1][0]
      botY = holder[1][1]
      botPieceCoords = holder[0]
      botPiece = document.querySelector(`.piece[data-coordinates="${botPieceCoords}"]`)
      return[botX, botY, botPiece]
}