export const generateHint = (board) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const possibleNumbers = getPossibleNumbers(row, col, board);
                if (possibleNumbers.length === 1) {
                    return {
                        cell: [row, col],
                        number: possibleNumbers[0],
                        message: `Since it is the only possible option, this cell must be ${possibleNumbers[0]}`
                    };
                }
            }
        }
    }
    return null;
};

const getPossibleNumbers = (row, col, board) => {
    const usedNumbers = new Set();

    // Check row
    for (let i = 0; i < 9; i++) {
        usedNumbers.add(board[row][i]);
    }

    // Check column
    for (let i = 0; i < 9; i++) {
        usedNumbers.add(board[i][col]);
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            usedNumbers.add(board[boxRow + i][boxCol + j]);
        }
    }

    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => !usedNumbers.has(num));
};