import Piece from './Piece'

const Square = (props) => {
    return (
        <div className={`square ${props.color}`}>
            {props.piece != null && <Piece color='black' data={props.piece}/>}
        </div>
    )
}

export default Square
