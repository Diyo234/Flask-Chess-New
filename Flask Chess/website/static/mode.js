let resizeHeight
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){        
    document.querySelector(".big-square").style.flexWrap = 'wrap';
    gameSquare = document.querySelector(".game-square")
    gameSquare.style.backgroundColor = 'transparent';
    gameSquare.style.height = 'calc(var(--square-size)*6)'
    gameSquare.style.width = 'calc(var(--square-size)*8)'
    rows = document.querySelectorAll(".change") 
    rows.forEach(function(element) {
        element.style.width = '100vw'
        element.style.borderBottom = '1vw solid black'
        element.style.borderTop = '1vw solid black'
    })
    resizeHeight = "8.1vw"
  } else{
    resizeHeight = "5vh"
  }

function online(){
    button = document.querySelectorAll('[category =first]')
    console.log(button)
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = online-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'block'
    });
    button = document.querySelector('[category = back-button]')
    button.style.display = 'block'
    
}
function offline(){
    button = document.querySelectorAll('[category = first]')
    console.log(button)
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = offline-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'block'
    });
    button = document.querySelector('[category = back-button]')
    button.style.display = 'block'
}
function back(){
    button = document.querySelectorAll('[category =first]')
    console.log(button)
    Array.from(button).forEach(element => {
        element.style.display = 'block'
    });
    button = document.querySelectorAll('[category = online-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = offline-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelector('[category = back-button]')
    button.style.display = 'none'
    gameSquare = document.querySelector('.game-square')
    gameSquare.firstChild.textContent =''
    
}
function selectColour(){
    button = document.querySelectorAll('[category = first]')
    console.log(button)
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = online-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = offline-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelector('[category  = back-button]')
    button.style.display = 'none'
    button = document.querySelector('[category  = white]')
    button.style.display = 'block'
    button = document.querySelector('[category  = black]')
    button.style.display = 'block'
    button = document.querySelector('[category  = random]')
    button.style.display = 'block'
}
function selectLevel(){
    button = document.querySelectorAll('[category = first]')
    console.log(button)
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = online-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelectorAll('[category = offline-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    button = document.querySelector('[category  = back-button]')
    button.style.display = 'none'
    button = document.querySelectorAll('[category = bot-button]')
    Array.from(button).forEach(element => {
        element.style.display = 'block'
    });
}
function botLevel(level){
    button = document.querySelectorAll('[category = bot-button]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    console.log(level)
    selectColour()
    fetch("/select_level", {
    method: "POST",
    body: JSON.stringify(level),
    headers: {
        "Content-Type": "application/json",
    },
});
    
}
let choice
let players
let player_colour
function startGame(data, colour){
    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        mobileComponents = document.querySelectorAll('[name="mobile"]');
        mobileComponents.forEach(function(element) {
            element.style.display = "block";
        })
        pieceSquares = document.querySelectorAll(".pieces-square")
        pieceSquares.forEach(function(element) {
            element.style.marginLeft = "0";
            element.style.marginRight = "0";
        })
        emptySquares = document.querySelectorAll('.empty-square');
        emptySquares.forEach(function(element) {
            element.parentNode.removeChild(element)
        })
        clockSquares = document.querySelectorAll('.clock-square');
        clockSquares.forEach(function(element) {
            element.parentNode.removeChild(element)
        })
        mobileScreen = document.querySelector('[id = "mobile-screen"]')
        mobileScreen.style.height = "85vh"
    }else{
        clocks = document.querySelectorAll('.clock-square')
        clocks.forEach(function(element) {
            element.style.display = "grid";
        })
        mobileIcons = document.querySelectorAll('.mobile-icon');
        mobileIcons.forEach(function(element) {
            element.parentNode.removeChild(element)
        })
        playersContainer = document.querySelector('[id = players-container]')
        playersContainer.style.display = 'block'
    }
    choice = data
    if (!colour){
        var colours = ["white", "black"]
        colour = colours[Math.floor(Math.random()*colours.length)];
    }
    player_colour = colour
    if (colour == "white"){
        players = ["player",data]
    } else if (colour == "black" && choice != "player"){
        players = [data,"player"]
        reverse("row1")
        reverse("row2")
        reverse("clock-column")
        reverse("players-container")
        reverse("column1")
        reverse("column2")
        rects = document.querySelectorAll(".white-cell, .black-cell")
        // rects.forEach(rect => {
        //     if (rect.classList.contains("white-cell") && !rect.classList.contains("chess-square")){
        //         console.log(rect)
        //         rect.classList.remove("white-cell");
        //         rect.classList.add("black-cell");
        //     } 
        //     else if (!rect.classList.contains("chess-square")){
        //         rect.classList.remove("black-cell");
        //         rect.classList.add("white-cell");
        //     }
        // })
        whiteTaken = document.getElementById("white-taken")
        blackTaken = document.getElementById("black-taken")
        whiteTaken.id = "black-taken"
        whiteTaken.classList.remove("white-cell")
        whiteTaken.classList.add("black-cell")
        blackTaken.id = "white-taken"
        blackTaken.classList.remove("black-cell")
        blackTaken.classList.add("white-cell")
        squares = document.querySelectorAll(".chess-square")
        squares.forEach(square => {
            currentCoordinates = square.getAttribute('data-coordinates');
            [x, y] = currentCoordinates.split(',').map(coord => parseInt(coord, 10));
            x = 7-x;
            y = 7-y
            square.setAttribute('data-coordinates', `${x},${y}`);
        });
        pieces = document.querySelectorAll(".piece")
        pieces.forEach(piece => {
            currentCoordinates = piece.getAttribute('data-coordinates');
            piece.parentNode.removeChild(piece)
            new_square = document.querySelector(`.chess-square[data-coordinates="${currentCoordinates}"]`);
            new_square.appendChild(piece)
        });
    } else{
        players = ["players",data]
    }
    loadScript(urlForBase)
    gameSquare = document.querySelector('.game-square')
    gameSquare.parentNode.removeChild(gameSquare)
    takenRows = document.querySelectorAll('.pieces-square')
    takenRows.forEach(function(element) {
        element.style.display = "flex";
    })
}
function reverse(id){
    const line = document.getElementById(id);
    const elements = Array.from(line.children);
    const reversedElements = elements.reverse();
    while (line.firstChild) {
        line.removeChild(line.firstChild);
    }
    reversedElements.forEach(element => line.appendChild(element));
}
function matchmaking(){
    gameSquare = document.querySelector('.game-square')
    console.log(gameSquare)
    gameSquare.firstChild.textContent = 'Searching...'
    button = document.querySelectorAll('[category = online-mode]')
    Array.from(button).forEach(element => {
        element.style.display = 'none'
    });
    socket = io()
    socket.on('start_white', function (data) {
        startGame("opponent","white")
    })
    socket.on('start_black', function (data) {
        startGame("opponent","black")
    })
    socket.on('colour', data => {
        const userColor = data.colour;
        console.log('User Color:', userColor);})
    

}