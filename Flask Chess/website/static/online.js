

  // Handle the 'connect' event
  socket.on('connect', () => {
      console.log('Connected to the server!');
  });
  socket.on('message', (data) => {
      console.log('Received a message:', data);
  });
function enPassant(data){
    
    socket.on('enPassant',function(data){
        enPassantAction(data)
})
}
function kingCheck(data){
    socket.on('king', function(data){
        kingAction(data)
    })
}
function checkmate(data){
    socket.emit('checkmate', data)
}

function stalemate(){
    socket.emit('stalemate')
}

function repetition(){
    socket.emit('repetition')
}
function movePiece(data){
    socket.emit('move', data);
}
function castling(data){
    socket.emit('castling',data)
}
function promotion(data){
    socket.emit('promotion', data)
}

function updateVariable(data){
    socket.emit('old variable', data)
}
socket.on('enPassant',function(data){
    enPassantAction(data)
})

socket.on('king', function(data){
    kingAction(data)
})

socket.on('new variable', function(data){
    turn = data
})
socket.on('game over', function(data){
    console.log("checkmate")
    checkmateAction(data)
})

socket.on('stalemated',function(){
    stalemateAction()
})

socket.on('draw by repetition',function(){
    repetitionAction()
})

socket.on('moved', function (data) {
    moveAction(data)
})
socket.on('castled', function(data){
    castlingAction(data)
})
socket.on('promoted', function(data){
    promotionAction(data)
})
socket.on('new variable', function(data){
    turn = data
  })