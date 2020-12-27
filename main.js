let chessBoardTable = document.getElementById("chessBoardTable")
let docChessBoardCells = []
var pieces = []
var selectedPiece = null
var playerTurn, whiteKing, blackKing
// dark purple, dark blue, light purple, light blue
var chessBoardColors = ['rgb(128, 0, 128)', 'rgb(32, 131, 160)', 'rgb(198, 70, 198)', 'rgb(92, 191, 220)']

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
    // moves the piece, returning true if moved succesful, otherwise false
    movePiece(targetCell, simulation = false) {
        // check if move is legit
        let legitMove = false
        if (!simulation) {
            this.moves.forEach(move => {
                if (move[0] - targetCell[0] == 0 && move[1] - targetCell[1] == 0) {
                    legitMove = true
                }
            })
        } else {
            legitMove = true
        }

        if (legitMove) {
            let tempCell = this.cell, tempPiece, captured = false
            let targetPieceIndex = cellContent(targetCell, true)
            let targetPiece = pieces[targetPieceIndex]
            // targeting empty cell
            if (targetPiece == null) {
                if (!simulation) {
                    console.log('moved', this.type + this.color, 'from', convertChessNotation(this.cell), 'to', convertChessNotation(targetCell));
                }
                this.cell = targetCell
            } else {
                //targeting enemy piece
                if (!simulation) {
                    console.log('moved', this.type + this.color, 'from', convertChessNotation(this.cell), 'to', convertChessNotation(targetCell));
                    console.log('and captured', targetPiece.type + targetPiece.color);
                }
                tempPiece = new Piece(targetPiece.type, targetPiece.color, targetPiece.cell)
                tempPiece.id = targetPiece.id
                tempPiece.moves = new Array(targetPiece.moves)[0]
                pieces.splice(targetPieceIndex, 1)
                captured = true
                this.cell = targetCell
            }
            // reseting pieces to previous state if invalid move
            if (kingExposed()) {
                // delete invalid move from this.moves
                for (let i = 0; i < this.moves.length; i++) {
                    if (this.moves[i][0] - targetCell[0] == 0 && this.moves[i][1] - targetCell[1] == 0) {
                        this.moves.splice(i, 1)
                        break
                    }
                }
                // returning to original position
                this.cell = tempCell
                if (captured) {
                    // reviving captured piece
                    pieces.push(tempPiece)
                }
                return false

            } else if (simulation) {
                // returning to original position
                this.cell = tempCell
                if (captured) {
                    // reviving captured piece
                    pieces.push(tempPiece)
                }
                // return true for the simulation
                return true

            } else if (playerTurn == 'b') {
                // else next turn
                playerTurn = 'w'
            } else {
                playerTurn = 'b'
            }
            return true
        } else {
            if (!simulation) {
                console.log('error: illegal move')
                console.log('tried to move', this.type + this.color, 'from',
                    convertChessNotation(this.cell), 'to', convertChessNotation(targetCell));
            }
            return false
        }
    }
    calculateNewPieceMoves() {
        this.moves = pieceMoves(this)
    }
}

// checking if move doesn't kill the king
function kingExposed() {
    let king
    if (playerTurn == 'b') {
        king = blackKing
    } else {
        king = whiteKing
    }

    for (let j = 0; j < pieces.length; j++) {
        pieces[j].calculateNewPieceMoves()
        for (let i = 0; i < pieces[j].moves.length; i++) {
            if (pieces[j].moves[i][0] - king.cell[0] == 0 && pieces[j].moves[i][1] - king.cell[1] == 0) {
                console.log('king exposed!', pieces[j], pieces[j].moves[i])
                return true
            }

        }

    }
    return false
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
    playerTurn = 'w'
    pieces.push(new Piece('R', playerColor, [7, 0]))
    pieces.push(new Piece('N', playerColor, [7, 1]))
    pieces.push(new Piece('B', playerColor, [7, 2]))
    pieces.push(new Piece('Q', playerColor, [7, 3]))
    pieces.push(new Piece('K', playerColor, [7, 4]))
    whiteKing = pieces[4]
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
    blackKing = pieces[20]
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
// returns cell content 
function cellContent(cell, onlyPieceIndex = false) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].cell[0] - cell[0] == 0 && pieces[i].cell[1] - cell[1] == 0) {
            if (!onlyPieceIndex) {
                return pieces[i]
            } else {
                return i
            }
        }
    }
    return null
}
// calculating possible piece moves (without king check)
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
    if (piece.type == 'R') {
        // check right
        for (let i = position[0] + 1; i < 8; i++) {
            targetPiece = cellContent([i, position[1]])
            if (targetPiece == null) {
                moveOptions.push([i, position[1]])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([i, position[1]])
                break
            } else {
                break
            }
        }
        // check down
        for (let i = position[1] + 1; i < 8; i++) {
            targetPiece = cellContent([position[0], i])
            if (targetPiece == null) {
                moveOptions.push([position[0], i])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([position[0], i])
                break
            } else {
                break
            }
        }

        // check left
        for (let i = position[0] - 1; i > -1; i--) {
            targetPiece = cellContent([i, position[1]])
            if (targetPiece == null) {
                moveOptions.push([i, position[1]])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([i, position[1]])
                break
            } else {
                break
            }
        }
        // check up
        for (let i = position[1] - 1; i > -1; i--) {
            targetPiece = cellContent([position[0], i])
            if (targetPiece == null) {
                moveOptions.push([position[0], i])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([position[0], i])
                break
            } else {
                break
            }
        }
    }
    if (piece.type == 'B') {

        // down right
        for (x = position[0] + 1, y = position[1] + 1; x < 8 && y < 8; x++, y++) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }

        // up left
        for (x = position[0] - 1, y = position[1] - 1; x > -1 && y > -1; x--, y--) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }

        // up right
        for (x = position[0] - 1, y = position[1] + 1; x > -1 && y < 8; x--, y++) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }

        // down left
        for (x = position[0] + 1, y = position[1] - 1; x < 8 && y > -1; x++, y--) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }
    }
    if (piece.type == 'N') {
        let knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
        let targetPos
        knightMoves.forEach(move => {
            targetPos = [position[0] + move[0], position[1] + move[1]]
            targetPiece = cellContent(targetPos)
            if (targetPiece == null) {
                moveOptions.push(targetPos)
            } else if (targetPiece.color != piece.color) {
                moveOptions.push(targetPos)
            }
        });
    }
    if (piece.type == 'Q') {

        // right
        for (let i = position[0] + 1; i < 8; i++) {
            targetPiece = cellContent([i, position[1]])
            if (targetPiece == null) {
                moveOptions.push([i, position[1]])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([i, position[1]])
                break
            } else {
                break
            }
        }
        // down
        for (let i = position[1] + 1; i < 8; i++) {
            targetPiece = cellContent([position[0], i])
            if (targetPiece == null) {
                moveOptions.push([position[0], i])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([position[0], i])
                break
            } else {
                break
            }
        }

        // left
        for (let i = position[0] - 1; i > -1; i--) {
            targetPiece = cellContent([i, position[1]])
            if (targetPiece == null) {
                moveOptions.push([i, position[1]])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([i, position[1]])
                break
            } else {
                break
            }
        }
        // up
        for (let i = position[1] - 1; i > -1; i--) {
            targetPiece = cellContent([position[0], i])
            if (targetPiece == null) {
                moveOptions.push([position[0], i])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([position[0], i])
                break
            } else {
                break
            }
        }

        // down right
        for (x = position[0] + 1, y = position[1] + 1; x < 8 && y < 8; x++, y++) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }
        // up left
        for (x = position[0] - 1, y = position[1] - 1; x > -1 && y > -1; x--, y--) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }

        // up right
        for (x = position[0] - 1, y = position[1] + 1; x > -1 && y < 8; x--, y++) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }

        // down left
        for (x = position[0] + 1, y = position[1] - 1; x < 8 && y > -1; x++, y--) {
            targetPiece = cellContent([x, y])
            if (targetPiece == null) {
                moveOptions.push([x, y])
            } else if (targetPiece.color != piece.color) {
                moveOptions.push([x, y])
                break
            } else {
                break
            }

        }
    }
    if (piece.type == 'K') {
        let kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
        let targetPos
        kingMoves.forEach(move => {
            targetPos = [position[0] + move[0], position[1] + move[1]]
            targetPiece = cellContent(targetPos)
            if (targetPiece == null) {
                moveOptions.push(targetPos)
            } else if (targetPiece.color != piece.color) {
                moveOptions.push(targetPos)
            }
        });
    }

    // delete moves not on the board
    for (let i = 0; i < moveOptions.length; i++) {
        if (moveOptions[i][0] > 7 || moveOptions[i][0] < 0 || moveOptions[i][1] > 7 || moveOptions[i][1] < 0) {
            moveOptions.splice(i, 1)
            i--
        }


    }

    return moveOptions
}
// console log all moves
function logAllPieceMoves(piece) {
    let moves = piece.moves
    let result = []
    for (let i = 0; i < moves.length; i++) {
        result.push(convertChessNotation(moves[i]))

    }
    return result
}
// render all pieces/changes on the chessboard
function renderPieces() {
    let tempPiece = null
    for (let i = 0; i < 64; i++) {
        tempPiece = cellContent([parseInt(i / 8), i % 8])
        if (tempPiece == null) {
            docChessBoardCells[parseInt(i / 8)][i % 8].innerHTML = ''
            continue
        } else {
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
// coloring the chessBoard
function baseColorChessboard() {
    for (let i = 0; i < 64; i++) {
        if (parseInt(i / 8) % 2 == 0) {
            if (i % 2 == 1) {
                docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = chessBoardColors[0]
            } else {
                docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = chessBoardColors[1]
            }
        } else if (i % 2 == 0) {
            docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = chessBoardColors[0]
        } else {
            docChessBoardCells[parseInt(i / 8)][i % 8].style.backgroundColor = chessBoardColors[1]
        }
    }
}
// highlight given cells
function highlightCells(cells) {
    cells.forEach(cell => {
        if (docChessBoardCells[cell[0]][cell[1]].style.backgroundColor == chessBoardColors[0]) {
            docChessBoardCells[cell[0]][cell[1]].style.backgroundColor = chessBoardColors[2]
        } else if (docChessBoardCells[cell[0]][cell[1]].style.backgroundColor == chessBoardColors[1]) {
            docChessBoardCells[cell[0]][cell[1]].style.backgroundColor = chessBoardColors[3]
        }
    });
}
// handling click event
function handlePieceClick() {
    if (selectedPiece == null) {
        let piece = cellContent([parseInt(this.id / 8), this.id % 8])
        if (piece != null) {
            selectedPiece = piece
            highlightCells(selectedPiece.moves)
            // highlight the possible moves
        }
    } else if (selectedPiece != null && selectedPiece.color == playerTurn) {
        //console.log('target cell', [parseInt(this.id / 8), this.id % 8]);
        succesfulMove = selectedPiece.movePiece([parseInt(this.id / 8), this.id % 8])

        // calculate new moves for every piece after succesful move
        if (succesfulMove) {
            pieces.forEach(piece => {
                piece.calculateNewPieceMoves()
            });
            gameEnd()
        }
        selectedPiece = null
        baseColorChessboard()
    } else {
        selectedPiece = null
        baseColorChessboard()
    }

    renderPieces()
}
// returns true if there are valid moves for the player
function simulateAllMoves() {
    pieces.forEach(piece => {
        // check only for the players turn
        if (piece.color == playerTurn) {
            piece.moves.forEach(move => {
                if (piece.movePiece(move, true)) {
                    return true
                }
            });
        }
    });
    return false
}

function gameEnd() {
    let king = whiteKing
    let noMoves = false
    if (playerTurn == 'b') {
        king = blackKing
    }
    noMoves = simulateAllMoves()


    if (noMoves) {

        let kingCheck = false
        pieces.forEach(piece => {
            // check only for the enemy pieces
            if (piece.color != playerTurn) {
                piece.moves.forEach(move => {
                    if (move[0] - king.cell[0] == 0 && move[1] - king.cell[1] == 0) {
                        kingCheck = true
                    }
                });
            }
        });

        if (kingCheck) {
            // lose
            console.log(king, 'checkmated')
        } else {
            // draw
            console.log(king, 'has no moves - draw');
        }
    }
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

baseColorChessboard()

spawnStartingPieces()

// add eventListeners and Id's to cells
for (let i = 0; i < 8; i++) {
    let count = 0
    docChessBoardCells[i].forEach(cell => {
        cell.addEventListener('click', handlePieceClick)
        cell.setAttribute('id', (i * 8 + count).toString())
        count++
    });

}

// calculate new moves for every piece
pieces.forEach(piece => {
    piece.calculateNewPieceMoves()
});

renderPieces()



//console.log(cellContent([0,0]));

//console.log(logAllPieceMoves(pieces[30]));

console.log('init finished'); 
