const startingPosition = []

    for (let i = 0; i < 8; i++) {
        startingPosition[i] = []
    }
    
    for (let i = 0; i < 8; i++) {
        startingPosition[i][1] = {
            type: 'pawn',
            color: 'white',
            hasMoved: false,
            possibleMoves: []
        }
    }

    startingPosition[0][0] = {
            type: 'rook',
            color: 'white',
            hasMoved: false,
            possibleMoves: []
    }

    startingPosition[7][0] = startingPosition[0][0]

    startingPosition[1][0] = {
        type: 'knight',
        color: 'white',
        hasMoved: false,
        possibleMoves: []
    }

    startingPosition[6][0] = startingPosition[1][0]

    startingPosition[2][0] = {
        type: 'bishop',
        color: 'white',
        hasMoved: false,
        possibleMoves: []
    }

    startingPosition[5][0] = startingPosition[2][0]

    startingPosition[3][0] = {
        type: 'queen',
        color: 'white',
        hasMoved: false,
        possibleMoves: []
    }

    startingPosition[4][0] = {
        type: 'king',
        color: 'white',
        hasMoved: false,
        possibleMoves: []
    }

    for (let i = 0; i < 8; i++) {
        startingPosition[i][7] = {...startingPosition[i][0], color: 'black'}
        startingPosition[i][6] = {...startingPosition[i][1], color: 'black'}
    }

    export default startingPosition