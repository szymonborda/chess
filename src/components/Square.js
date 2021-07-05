import Piece from './Piece'

const Square = (props) => {
    return (
        <div className={`square ${props.color} ${props.selected ? 'square-selected' : ''} ${props.lastMoved ? 'square-last-moved' : ''}`} onClick={() => props.squareOnClick(props.column, props.row, props.piece)}>
            {props.piece != null && <Piece color='black' data={props.piece}/>}
        </div>
    )
}

export default Square
