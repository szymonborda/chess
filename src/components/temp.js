    if (piece.type === 'pawn') {
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
        
    } else if (piece.type === 'rook') {
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
    } else {
        console.log('err')
    }