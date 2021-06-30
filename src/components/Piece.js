import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from 'react-icons/fa'

const Piece = (props) => {

    let pieceToRender = <FaChessPawn size={35}/>

    switch(props.data.type) {
        case 'pawn':
            pieceToRender = <FaChessPawn size={35}/>
        break;
        case 'rook':
            pieceToRender = <FaChessRook size={35}/>
        break;
        case 'knight':
            pieceToRender = <FaChessKnight size={35}/>
        break;
        case 'bishop':
            pieceToRender = <FaChessBishop size={35}/>
        break;
        case 'queen':
            pieceToRender = <FaChessQueen size={35}/>
        break;
        case 'king':
            pieceToRender = <FaChessKing size={35}/>
        break;
        default:
        break;
    }

    return (
        <div className={`piece piece-${props.data.type} piece-${props.data.color}`}>
            {pieceToRender}
        </div>
    )
}

export default Piece
