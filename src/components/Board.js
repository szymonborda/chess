import { useState } from 'react'
import Square from './Square'
import startingPosition from './startingPosition'

const Board = () => {   

    const [boardMatrix, setBoardMatrix] = useState(startingPosition)

    const squaresToRender = []

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            squaresToRender.push(<Square piece={boardMatrix[j][i]} key={String.fromCharCode(97 + j) + (i + 1)} column={j + 1} row={i + 1} color={(i % 2) ? ((j % 2) ? 'square-black' : 'square-white') : ((j % 2) ? 'square-white' : 'square-black')}/>)
        }   
    }

    return (
        <div className='board'>
            {squaresToRender}
        </div>
    )
}

export default Board
