import { useState, useEffect } from 'react'
import Square from './Square'
import startingPosition from './startingPosition'

const Board = () => {   

    const [boardMatrix, setBoardMatrix] = useState(startingPosition)
    const [selectedSquare, setSelectedSquare] = useState([null, null])
    const [lastMove, setLastMove] = useState([])

    const squaresToRender = []

    useEffect(() => {
        calculatePossibleMoves()
    }, [lastMove])

    const movePiece = (fromCol, fromRow, toCol, toRow) => {
        let boardMatrixCopy = boardMatrix
        let pieceToMove = boardMatrix[fromCol][fromRow]
        boardMatrixCopy[fromCol][fromRow] = null
        boardMatrixCopy[toCol][toRow] = {...pieceToMove, hasMoved: true}
        setBoardMatrix(boardMatrixCopy)
        setLastMove([fromCol, fromRow], [toCol, toRow])
    }

    const squareOnClick = (column, row, piece) => {
        if ((selectedSquare[0] != null) && (selectedSquare[1] != null)) {
            if (boardMatrix[selectedSquare[0]][selectedSquare[1]].possibleMoves.filter(move => (move[0] === column) && (move[1] === row)).length > 0) {
                movePiece(selectedSquare[0], selectedSquare[1], column, row)
            }
            setSelectedSquare([null, null])

        } else if (piece != null) {
            setSelectedSquare([column, row])
        }
    }

    const isMovePossible = (color, col, row) => {
        if ((col < 8) && (row < 8)) {
            if (boardMatrix[col][row] == null) {
                return true
            } else if (boardMatrix[col][row].color !== color) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const isMoveTaking = (color, col, row) => {
        if (boardMatrix[col][row] == null) {
            return false
        } else if (boardMatrix[col][row].color !== color) {
            return true
        } else {
            return false
        }
    }
    
    const calculatePossibleMoves = () => {
        setBoardMatrix(boardMatrix.map((column, i) => {
            column.map((piece, j) => {
                if (piece != null) {
                    piece.possibleMoves = []
                    switch(piece.type) {
                        case 'pawn':
                            if (piece.color === 'white') {
                                if (piece.hasMoved) {
                                    piece.possibleMoves = [isMovePossible(piece.color, i, j + 1) ? [i, j + 1] : []]
                                } else {
                                    piece.possibleMoves = [isMovePossible(piece.color, i, j + 1) ? [i, j + 1] : [], isMovePossible(piece.color, i, j + 2) ? [i, j + 2] : []]
                                }
                            } else {
                                if (piece.hasMoved) {
                                    piece.possibleMoves = [isMovePossible(piece.color, i, j - 1) ? [i, j - 1] : []]
                                } else {
                                    piece.possibleMoves = [isMovePossible(piece.color, i, j - 1) ? [i, j - 1] : [], isMovePossible(piece.color, i, j - 2) ? [i, j - 2] : []]
                                }
                            }
                            
                        break
                        case 'rook':
                            for (let k = 1; k < 8 - j; k++) {
                                if (isMovePossible(piece.color, i, j + k)) {
                                    piece.possibleMoves.push([i, j + k])
                                } else {
                                    break
                                }

                                if (isMoveTaking(piece.color, i, j + k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < j + 1; k++) {
                                if (isMovePossible(piece.color, i, j - k)) {
                                    piece.possibleMoves.push([i, j - k])
                                } else {
                                    break
                                }

                                if (isMoveTaking(piece.color, i, j - k)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < 8 - i; k++) {
                                if (isMovePossible(piece.color, i + k, j)) {
                                    piece.possibleMoves.push([i + k, j])
                                } else {
                                    break
                                }

                                if (isMoveTaking(piece.color, i + k, j)) {
                                    break
                                }
                                
                            }

                            for (let k = 1; k < i + 1; k++) {
                                if (isMovePossible(piece.color, i - k, j)) {
                                    piece.possibleMoves.push([i - k, j])
                                } else {
                                    break
                                }

                                if (isMoveTaking(piece.color, i - k, j)) {
                                    break
                                }
                                
                            }
                        break
                        default:
                        break
                    }
                }
                if ((i === 0) && (j === 0)) console.log(piece)
                return piece
            })
            return column
        }))
    }

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            squaresToRender.push(<Square selected={((selectedSquare[0] === j) && (selectedSquare[1] === i))} squareOnClick={squareOnClick} piece={boardMatrix[j][i]} key={String.fromCharCode(97 + j) + (i + 1)} column={j} row={i} color={(i % 2) ? ((j % 2) ? 'square-black' : 'square-white') : ((j % 2) ? 'square-white' : 'square-black')}/>)
        }   
    }

    return (
        <div className='board'>
            {squaresToRender}
        </div>
    )
}

export default Board
