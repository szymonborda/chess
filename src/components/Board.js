import { useState } from 'react'
import Square from './Square'
import startingPosition from './startingPosition'

const Board = () => {   

    const [boardMatrix, setBoardMatrix] = useState(startingPosition)
    const [selectedSquare, setSelectedSquare] = useState([null, null])

    const squaresToRender = []

    const movePiece = (fromCol, fromRow, toCol, toRow) => {
        let boardMatrixCopy = boardMatrix
        let pieceToMove = boardMatrix[fromCol][fromRow]
        boardMatrixCopy[fromCol][fromRow] = null
        boardMatrixCopy[toCol][toRow] = {...pieceToMove, hasMoved: true}
        setBoardMatrix(boardMatrixCopy)

    }

    const squareOnClick = (column, row, piece) => {
        if ((selectedSquare[0] != null) && (selectedSquare[1] != null)) { //a LOT of rules to add here
            movePiece(selectedSquare[0], selectedSquare[1], column, row)
            setSelectedSquare([null, null])

        } else if (piece != null) {
            setSelectedSquare([column, row])
        }
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
