chessBoardTable = document.getElementById("chessBoardTable")

let docChessBoardCells = []
var pieces = []
var selectedPiece = null

class Piece {
    constructor(type, color, cell) {
        this.type = type
        this.color = color
        this.cell = cell // [0,0]
        this.id = this.setId()
        this.moves = []

    }
    setId() {
        let count = 0
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].type == this.type && pieces[i].color == this.color) {
                count++
            }
        }
        return count
    }
    movePiece(targetCell) {
        // check if move is legit
        let contains = false
        this.moves.forEach(move => {
            if (move[0] - targetCell[0] == 0 && move[1] - targetCell[1] == 0) {
                contains = true
            }
        })

        if (contains) {

            let targetPiece = cellContent(targetCell)
            if (targetPiece == null) {
                console.log('moved', this.type + this.color, 'from', convertChessNotation(this.cell), 'to', convertChessNotation(targetCell));
                this.cell = targetCell
            }//else{
            // delete captured piece
            //}

            this.calculateNewPieceMoves()
        } else {

            console.log('error: illegal move')
            console.log('tried to move', this.type + this.color, 'from', convertChessNotation(this.cell), 'to', convertChessNotation(targetCell));
        }
    }
    calculateNewPieceMoves() {
        this.moves = pieceMoves(this)
    }
}

// 0 -> A8 ; 63 -> H1 ; 
function convertChessNotation(index) {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

    if (typeof (index) == 'string') {
        result = []
        for (let i = 0; i < letters.length; i++) {
            if (index[0].toUpperCase() == letters[i]) {
                result.push(8 - parseInt(index[1]))
                result.push(parseInt(i))
                break
            }
        }

    } else if (typeof (index) == 'object') {
        //array format [5,0]
        result = letters[index[1]] + (8 - index[0]).toString()

    } else {
        result = letters[index % 8] + (8 - parseInt(index / 8))
    }
    return result
}
// spawn starting pieces
function spawnStartingPieces(playerWhite = true) {
    if (playerWhite) {
        playerColor = 'w'
        AIColor = 'b'
    } else {
        playerColor = 'b'
        AIColor = 'w'
    }
    pieces.push(new Piece('R', playerColor, [7, 0]))
    pieces.push(new Piece('N', playerColor, [7, 1]))
    pieces.push(new Piece('B', playerColor, [7, 2]))
    pieces.push(new Piece('Q', playerColor, [7, 3]))
    pieces.push(new Piece('K', playerColor, [7, 4]))
    pieces.push(new Piece('B', playerColor, [7, 5]))
    pieces.push(new Piece('N', playerColor, [7, 6]))
    pieces.push(new Piece('R', playerColor, [7, 7]))

    pieces.push(new Piece('P', playerColor, [6, 0]))
    pieces.push(new Piece('P', playerColor, [6, 1]))
    pieces.push(new Piece('P', playerColor, [6, 2]))
    pieces.push(new Piece('P', playerColor, [6, 3]))
    pieces.push(new Piece('P', playerColor, [6, 4]))
    pieces.push(new Piece('P', playerColor, [6, 5]))
    pieces.push(new Piece('P', playerColor, [6, 6]))
    pieces.push(new Piece('P', playerColor, [6, 7]))


    pieces.push(new Piece('R', AIColor, [0, 0]))
    pieces.push(new Piece('N', AIColor, [0, 1]))
    pieces.push(new Piece('B', AIColor, [0, 2]))
    pieces.push(new Piece('Q', AIColor, [0, 3]))
    pieces.push(new Piece('K', AIColor, [0, 4]))
    pieces.push(new Piece('B', AIColor, [0, 5]))
    pieces.push(new Piece('N', AIColor, [0, 6]))
    pieces.push(new Piece('R', AIColor, [0, 7]))

    pieces.push(new Piece('P', AIColor, [1, 0]))
    pieces.push(new Piece('P', AIColor, [1, 1]))
    pieces.push(new Piece('P', AIColor, [1, 2]))
    pieces.push(new Piece('P', AIColor, [1, 3]))
    pieces.push(new Piece('P', AIColor, [1, 4]))
    pieces.push(new Piece('P', AIColor, [1, 5]))
    pieces.push(new Piece('P', AIColor, [1, 6]))
    pieces.push(new Piece('P', AIColor, [1, 7]))


}
// TODO return null when searched cell is out of board
function cellContent(cell) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].cell[0] - cell[0] == 0 && pieces[i].cell[1] - cell[1] == 0) {
            return pieces[i]
        }
    }
    return null
}
// calculating piece moves
function pieceMoves(piece) {
    let moveOptions = []
    let position = piece.cell
    let targetPiece = null
    if (piece.type == 'P') {
        if (piece.color == 'w') {
            // moving one up
            targetPiece = cellContent([position[0] - 1, position[1]])
            if (targetPiece == null) {
                moveOptions.push([position[0] - 1, position[1]])

                // moving two up from starting position
                if (position[0] == 6) {
                    targetPiece = cellContent([4, position[1]])
                    if (targetPiece == null) {
                        moveOptions.push([4, position[1]])
                    }
                }
            }

            // diagonal move - capture - left
            targetPiece = cellContent([position[0] - 1, position[1] - 1])
            if (targetPiece != null && targetPiece.color != piece.color) {
                moveOptions.push([position[0] - 1, position[1] - 1])
            }
            // diagonal move - capture - right
            targetPiece = cellContent([position[0] - 1, position[1] + 1])
            if (targetPiece != null && targetPiece.color != piece.color) {
                moveOptions.push([position[0] - 1, position[1] + 1])
            }
        } else if (piece.color == 'b') {
            // moving one down
            targetPiece = cellContent([position[0] + 1, position[1]])
            if (targetPiece == null) {
                moveOptions.push([position[0] + 1, position[1]])

                // moving two down from starting position
                if (position[0] == 1) {
                    targetPiece = cellContent([3, position[1]])
                    if (targetPiece == null) {
                        moveOptions.push([3, position[1]])
                    }
                }
            }

            // diagonal move - capture - left
            targetPiece = cellContent([position[0] + 1, position[1] - 1])
            if (targetPiece != null && targetPiece.color != piece.color) {
                moveOptions.push([position[0] + 1, position[1] - 1])
            }
            // diagonal move - capture - right
            targetPiece = cellContent([position[0] + 1, position[1] + 1])
            if (targetPiece != null && targetPiece.color != piece.color) {
                moveOptions.push([position[0] + 1, position[1] + 1])
            }
        }

    }
    return moveOptions
}
// console log all moves
function logAllPieceMoves(piece) {
    let moves = pieceMoves(piece)
    let result = []
    for (let i = 0; i < moves.length; i++) {
        result.push(convertChessNotation(moves[i]))

    }
    return result
}
// render all pieces on chessboard
function renderPieces() {
    let tempPiece = null  
    for (let i = 0; i < 64; i++) {
        tempPiece = cellContent([parseInt(i / 8), i % 8])
        if (tempPiece == null) {
            docChessBoardCells[parseInt(i / 8)][i % 8].innerHTML = ''
            continue
        }else{
            docChessBoardCells[parseInt(i / 8)][i % 8].innerHTML = tempPiece.type
            if (tempPiece.color == 'w') {
                docChessBoardCells[tempPiece.cell[0]][tempPiece.cell[1]].style.color = 'white'
            } else {
                docChessBoardCells[tempPiece.cell[0]][tempPiece.cell[1]].style.color = 'black'
            }
        }
        
    }
    /* rendering only pieces
    pieces.forEach(piece => {
        docChessBoardCells[piece.cell[0]][piece.cell[1]].innerHTML = (piece.type).toString()
        if (piece.color == 'w') {
            docChessBoardCells[piece.cell[0]][piece.cell[1]].style.color = 'white'
        } else {
            docChessBoardCells[piece.cell[0]][piece.cell[1]].style.color = 'black'
        }
    });
    */
}

function handlePieceClick() {
    if (selectedPiece == null) {
        let piece = cellContent([parseInt(this.id / 8), this.id % 8])
        if (piece != null) {
            selectedPiece = piece
            // highlight the possible moves
        }
    } else if (selectedPiece != null) {
        console.log('target cell', [parseInt(this.id / 8), this.id % 8]);
        selectedPiece.movePiece([parseInt(this.id / 8), this.id % 8])
        selectedPiece = null
    }
    renderPieces()
}
//-------------------------------------------------------------------

// chessboard HTML cells to JS array
for (let i = 0; i < 64; i++) {
    if (i % 8 == 0) {
        docChessBoardCells.push([])
        //pieces.push([])
    }
    docChessBoardCells[parseInt(i / 8)].push(document.getElementsByClassName("chessBoardCell")[i])

}

// coloring the chessBoard
for (let i = 0; i < 64; i++) {
    if (parseInt(i / 8) % 2 == 0) {
        if (i % 2 == 1) {
            docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = 'purple'
        } else {
            docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = 'lightblue'
        }
    } else if (i % 2 == 0) {
        docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = 'purple'
    } else {
        docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = 'lightblue'
    }
}

spawnStartingPieces()

pieces.forEach(piece => {
    piece.calculateNewPieceMoves()
});

renderPieces()

// add eventListeners and Id's to cells
for (let i = 0; i < 8; i++) {
    let count = 0
    docChessBoardCells[i].forEach(cell => {
        cell.addEventListener('click', handlePieceClick)
        cell.setAttribute('id', (i * 8 + count).toString())
        count++
    });

}


//console.log(cellContent([0,0]));

//console.log(logAllPieceMoves(pieces[30]));

console.log('end'); 
