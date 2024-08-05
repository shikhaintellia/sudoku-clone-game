
//function to check if a number is valid in a given position
export const sudokuValidation = (board, row, col, num) => {
    //Check if the number is already in the row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }

    //Check if the number is already in the column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }

    //Check if the number is in the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) {
                return false;
            }
        }
    }

    return true;
}
