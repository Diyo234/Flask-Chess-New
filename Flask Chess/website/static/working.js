let isPresent = Array.from(takenSquare.children).some(existingPiece => existingPiece.firstChild?.src === piece.src);
        if (!isPresent) {
            takenPiece = document.createElement('img');
            takenPiece.src = piece.src;
            takenPiece.value = piece.dataset.value
            takenPiece.number = 1
            takenPiece.classList.add('resize')
            takenPiece.type = piece.dataset.type
            square = takenSquare.children[4]
            console.log(square)
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