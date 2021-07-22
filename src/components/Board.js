import { useState, useEffect } from 'react'
import Square from './Square'
import startingPosition from './startingPosition'

const Board = () => {   

    const [boardMatrix, setBoardMatrix] = useState(startingPosition)
    const [selectedSquare, setSelectedSquare] = useState([null, null])
    const [lastMove, setLastMove] = useState([[null, null], [null, null]])
    const [whoseTurn, setWhoseTurn] = useState('black')
    const [whiteKingIndex, setWhiteKingIndex] = useState([4, 0])
    const [blackKingIndex, setBlackKingIndex] = useState([4, 7])

    const squaresToRender = []

    useEffect(() => {
        setBoardMatrix(calculatePossibleMoves(boardMatrix, true))
        changeTurn()
        finishIfNeeded()
        //console.log(checkIfPlayerLose('black'))
    }, [lastMove])

    const movePiece = (fromCol, fromRow, toCol, toRow) => {
        let boardMatrixCopy = boardMatrix
        let pieceToMove = boardMatrix[fromCol][fromRow]
        boardMatrixCopy[fromCol][fromRow] = null
        boardMatrixCopy[toCol][toRow] = {...pieceToMove, hasMoved: true}
        setBoardMatrix(boardMatrixCopy)
        setLastMove([[fromCol, fromRow], [toCol, toRow]])
        if (boardMatrix[toCol][toRow].type === 'king') {
            if (boardMatrix[toCol][toRow].color === 'white') {
                setWhiteKingIndex([toCol, toRow])
            } else {
                setBlackKingIndex([toCol, toRow])
            }
        }
    }

    const changeTurn = () => {
        if (whoseTurn === 'white') {
            setWhoseTurn('black')
        } else {
            setWhoseTurn('white')
        }
    }

    const checkIfPlayerHasMoves = (playerColor) => {
        let toReturn = false
        boardMatrix.forEach((col) => {
            col.forEach((piece) => {
                if (piece !== null) {
                    if ((piece.color === playerColor) && (piece.possibleMoves.length > 0)) {
                        toReturn = true
                    }
                }
            })
        })
        return toReturn
    }

    const finishIfNeeded = () => {
        let hasWhiteMoves = checkIfPlayerHasMoves('white')
        let hasBlackMoves = checkIfPlayerHasMoves('black')
        let inCheck = whoIsInCheck(boardMatrix, whiteKingIndex, blackKingIndex)

        if (!hasWhiteMoves) {
            if (inCheck === 'white') {
                alert('Black won by checkmate!')
            } else {
                alert('Draw by stalemate!')
            }
        }

        if (!hasBlackMoves) {
            if (inCheck === 'black') {
                alert('White won by checkmate!')
            } else {
                alert('Draw by stalemate!')
            }
        }
    }
    const squareOnClick = (column, row, piece) => {
        if ((selectedSquare[0] != null) && (selectedSquare[1] != null)) {
            if (boardMatrix[selectedSquare[0]][selectedSquare[1]].possibleMoves.filter(move => (move[0] === column) && (move[1] === row)).length > 0) {
                if (boardMatrix[selectedSquare[0]][selectedSquare[1]].color === whoseTurn) movePiece(selectedSquare[0], selectedSquare[1], column, row)
            }
            setSelectedSquare([null, null])

        } else if (piece != null) {
            setSelectedSquare([column, row])
        }
    }

    const isMoveOnBoard = (board, piece, col, row) => {
        if ((col < 8) && (row < 8) && (col >= 0) && (row >= 0)) {
            if (board[col][row] == null) {
                return true
            } else if (board[col][row].color !== piece.color) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const isMovePossible = (board, piece, checkChecks, fromCol, fromRow, toCol, toRow) => {
        if (checkChecks) {
            return ((isMoveOnBoard(board, piece, toCol, toRow)) && (isMoveNotSelfcheck(piece, fromCol, fromRow, toCol, toRow)))
        } else {
            return isMoveOnBoard(board, piece, toCol, toRow)
        }
    }

    const isMoveTaking = (board, piece, col, row) => {
        if (board[col][row] == null) {
            return false
        } else if (board[col][row].color !== piece.color) {
            return true
        } else {
            return false
        }
    }

    const isMoveNotSelfcheck = (piece, fromCol, fromRow, toCol, toRow) => {
        let board = boardMatrix.map(arr => arr.slice().map(piece => {
            if (piece !== null) {
                return {...piece}
            } else {
                return null
            }
        }))
        let whiteKing = [...whiteKingIndex]
        let blackKing = [...blackKingIndex]
        board[fromCol][fromRow] = null
        board[toCol][toRow] = {...piece, hasMoved: true}

        if (board[toCol][toRow].type === 'king') {
            if (board[toCol][toRow].color === 'white') {
                whiteKing = [toCol, toRow]
            } else {
                blackKing = [toCol, toRow]
            }
        }
        
        board = calculatePossibleMoves(board, false)

        if (piece.color === whoIsInCheck(board, whiteKing, blackKing)) {
            return false
        } else {
            return true
        }
    }

    const whoIsInCheck = (board, whiteKing, blackKing) => {
        let toReturn = 'no one'
        board.forEach((column, i) => {
            column.forEach((piece, j) => {
                if (piece != null) {
                    piece.possibleMoves.forEach((possibleMove) => {
                        if ((possibleMove[0] === whiteKing[0]) && (possibleMove[1] === whiteKing[1]) &&(piece.color === 'black')) {
                            toReturn = 'white'
                        } else if ((possibleMove[0] === blackKing[0]) && (possibleMove[1] === blackKing[1]) &&(piece.color === 'white')) {
                            toReturn = 'black'
                        }
                    })
                }
            })
        })
        return toReturn
    }
    
    const calculatePossibleMoves = (board, checkChecks) => {
        return board.map((column, i) => {
            column.map((piece, j) => {
                if (piece != null) {
                    piece.possibleMoves = []
                    switch(piece.type) {
                        case 'pawn':
                            if (piece.color === 'white') {
                                if (piece.hasMoved) {
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i, j + 1)) && (!isMoveTaking(board, piece, i, j + 1))) {
                                        piece.possibleMoves.push([i, j + 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i + 1, j + 1)) && (isMoveTaking(board, piece, i + 1, j + 1))) {
                                        piece.possibleMoves.push([i + 1, j + 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i - 1, j + 1)) && (isMoveTaking(board, piece, i - 1, j + 1))) {
                                        piece.possibleMoves.push([i - 1, j + 1])
                                    }
                                } else {
                                    for (let k = 1; k < 3; k++) {
                                        if ((isMovePossible(board, piece, checkChecks, i, j, i, j + k)) && (!isMoveTaking(board, piece, i, j + k))) {
                                            piece.possibleMoves.push([i, j + k])
                                        } else if (isMoveTaking(board, piece, i, j + k)) {
                                            break
                                        } else if (!isMoveOnBoard(board, piece, i, j + k)) {
                                            break
                                        }
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i + 1, j + 1)) && (isMoveTaking(board, piece, i + 1, j + 1))) {
                                        piece.possibleMoves.push([i + 1, j + 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i - 1, j + 1)) && (isMoveTaking(board, piece, i - 1, j + 1))) {
                                        piece.possibleMoves.push([i - 1, j + 1])
                                    }
                                }
                            } else {
                                if (piece.hasMoved) {
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i, j - 1)) && (!isMoveTaking(board, piece, i, j - 1))) {
                                        piece.possibleMoves.push([i, j - 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i + 1, j - 1)) && (isMoveTaking(board, piece, i + 1, j - 1))) {
                                        piece.possibleMoves.push([i + 1, j - 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i - 1, j - 1)) && (isMoveTaking(board, piece, i - 1, j - 1))) {
                                        piece.possibleMoves.push([i - 1, j - 1])
                                    }
                                } else {
                                    for (let k = 1; k < 3; k++) {
                                        if ((isMovePossible(board, piece, checkChecks, i, j, i, j - k)) && (!isMoveTaking(board, piece, i, j - k))) {
                                            piece.possibleMoves.push([i, j - k])
                                        } else if (isMoveTaking(board, piece, i, j - k)) {
                                            break
                                        } else if (!isMoveOnBoard(board, piece, i, j - k)) {
                                            break
                                        }
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i + 1, j - 1)) && (isMoveTaking(board, piece, i + 1, j - 1))) {
                                        piece.possibleMoves.push([i + 1, j - 1])
                                    }
                                    if ((isMovePossible(board, piece, checkChecks, i, j, i - 1, j - 1)) && (isMoveTaking(board, piece, i - 1, j - 1))) {
                                        piece.possibleMoves.push([i - 1, j - 1])
                                    }
                                }
                            }
                        break
                        case 'rook':
                            for (let k = 1; k < 8 - j; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i, j + k)) {
                                    piece.possibleMoves.push([i, j + k])
                                } else if (!isMoveOnBoard(board, piece, i, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < j + 1; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i, j - k)) {
                                    piece.possibleMoves.push([i, j - k])
                                } else if (!isMoveOnBoard(board, piece, i, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8 - i; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j)) {
                                    piece.possibleMoves.push([i + k, j])
                                } else if (!isMoveOnBoard(board, piece, i + k, j)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < i + 1; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j)) {
                                    piece.possibleMoves.push([i - k, j])
                                } else if (!isMoveOnBoard(board, piece, i - k, j)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j)) {
                                    break
                                }
                                
                            }
                        break
                        case 'bishop':
                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j + k)) {
                                    piece.possibleMoves.push([i + k, j + k])
                                } else if (!isMoveOnBoard(board, piece, i + k, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j - k)) {
                                    piece.possibleMoves.push([i + k, j - k])
                                } else if (!isMoveOnBoard(board, piece, i + k, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j + k)) {
                                    piece.possibleMoves.push([i - k, j + k])
                                } else if (!isMoveOnBoard(board, piece, i - k, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j - k)) {
                                    piece.possibleMoves.push([i - k, j - k])
                                } else if (!isMoveOnBoard(board, piece, i - k, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j - k)) {
                                    break
                                }
                                
                            }
                        break
                        case 'queen':
                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j + k)) {
                                    piece.possibleMoves.push([i + k, j + k])
                                } else if (!isMoveOnBoard(board, piece, i + k, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j - k)) {
                                    piece.possibleMoves.push([i + k, j - k])
                                } else if (!isMoveOnBoard(board, piece, i + k, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j + k)) {
                                    piece.possibleMoves.push([i - k, j + k])
                                } else if (!isMoveOnBoard(board, piece, i - k, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j - k)) {
                                    piece.possibleMoves.push([i - k, j - k])
                                } else if (!isMoveOnBoard(board, piece, i - k, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8 - j; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i, j + k)) {
                                    piece.possibleMoves.push([i, j + k])
                                } else if (!isMoveOnBoard(board, piece, i, j + k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < j + 1; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i, j - k)) {
                                    piece.possibleMoves.push([i, j - k])
                                } else if (!isMoveOnBoard(board, piece, i, j - k)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8 - i; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i + k, j)) {
                                    piece.possibleMoves.push([i + k, j])
                                } else if (!isMoveOnBoard(board, piece, i + k, j)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i + k, j)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < i + 1; k++) {
                                if (isMovePossible(board, piece, checkChecks, i, j, i - k, j)) {
                                    piece.possibleMoves.push([i - k, j])
                                } else if (!isMoveOnBoard(board, piece, i - k, j)) {
                                    break
                                }

                                if (isMoveTaking(board, piece, i - k, j)) {
                                    break
                                }
                                
                            }
                        break
                        case 'knight':
                            if (isMovePossible(board, piece, checkChecks, i, j, i + 2, j + 1)) piece.possibleMoves.push([i + 2, j + 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i + 1, j + 2)) piece.possibleMoves.push([i + 1, j + 2])

                            if (isMovePossible(board, piece, checkChecks, i, j, i - 2, j - 1)) piece.possibleMoves.push([i - 2, j - 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i - 1, j - 2)) piece.possibleMoves.push([i - 1, j - 2])

                            if (isMovePossible(board, piece, checkChecks, i, j, i + 2, j - 1)) piece.possibleMoves.push([i + 2, j - 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i + 1, j - 2)) piece.possibleMoves.push([i + 1, j - 2])

                            if (isMovePossible(board, piece, checkChecks, i, j, i - 2, j + 1)) piece.possibleMoves.push([i - 2, j + 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i - 1, j + 2)) piece.possibleMoves.push([i - 1, j + 2])
                        break
                        case 'king':
                            if (isMovePossible(board, piece, checkChecks, i, j, i, j + 1)) piece.possibleMoves.push([i, j + 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i + 1, j + 1)) piece.possibleMoves.push([i + 1, j + 1])

                            if (isMovePossible(board, piece, checkChecks, i, j, i + 1, j)) piece.possibleMoves.push([i + 1, j])
                            if (isMovePossible(board, piece, checkChecks, i, j, i + 1, j - 1)) piece.possibleMoves.push([i + 1, j - 1])

                            if (isMovePossible(board, piece, checkChecks, i, j, i, j - 1)) piece.possibleMoves.push([i, j - 1])
                            if (isMovePossible(board, piece, checkChecks, i, j, i - 1, j - 1)) piece.possibleMoves.push([i - 1, j - 1])

                            if (isMovePossible(board, piece, checkChecks, i, j, i - 1, j)) piece.possibleMoves.push([i - 1, j])
                            if (isMovePossible(board, piece, checkChecks, i, j, i - 1, j + 1)) piece.possibleMoves.push([i - 1, j + 1])
                        break
                        default:
                        break
                    }
                }
                return piece
            })
            return column
        })
    }

    const isSquarePossibleToMove = (i, j) => {
        if ((selectedSquare[0] !== null) && (selectedSquare[1] !== null)) {
            let toReturn = false
            boardMatrix[selectedSquare[0]][selectedSquare[1]].possibleMoves.forEach((move) => {
                if ((move[0] === j) && (move[1] === i)) toReturn = true
            })
            return toReturn
        } else {
            return false
        }
    }

    for (let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            squaresToRender.push(<Square 
                selected={((selectedSquare[0] === j) && (selectedSquare[1] === i))}
                lastMoved={(((lastMove[0][0] === j) && (lastMove[0][1] === i)) || ((lastMove[1][0] === j) && (lastMove[1][1] === i)))}
                possibleToMove = {isSquarePossibleToMove(i, j)}
                squareOnClick={squareOnClick} 
                piece={boardMatrix[j][i]} 
                key={String.fromCharCode(97 + j) + (i + 1)} 
                column={j} 
                row={i} 
                color={(i % 2) ? ((j % 2) ? 'square-black' : 'square-white') : ((j % 2) ? 'square-white' : 'square-black')
            }/>)
        }   
    }

    return (
        <div className='board'>
            {squaresToRender}
        </div>
    )
}

export default Board
