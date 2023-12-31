import { 
    PLAYFILED_COLUMNS, 
    PLAYFILED_ROWS, 
    TETROMINO_NAMES, 
    getRandomElement,
    TETROMINOES,
    rotateMatrix
} from "./utilites.js";


class Tetris {
    constructor() {
        this.playfield;
        this.tetramino;
        this.isGameOver = false;
        this.init();
    }

    init() {
        this.generatePlayfild();
        this.generateTetramino();
    }


    generatePlayfild() {
       this.playfield = new Array(PLAYFILED_ROWS).fill().map(() => new Array(PLAYFILED_COLUMNS).fill(0));    
    }

    generateTetramino() {
        const name = getRandomElement(TETROMINO_NAMES);
        const matrix = TETROMINOES[name];

        const column = PLAYFILED_COLUMNS / 2 - Math.floor(matrix.length / 2);
        const row = -2;

        this.tetramino = {
            name,
            matrix,
            row,
            column,
            ghostColumn: column,
            ghostRow: row,
        }

        this.calculateGhostPosition();
    }

    moveTetrominoDown() {
        this.tetramino.row += 1;
        if (!this.isValid()) {
            this.tetramino.row -= 1;
            this.placeTetromino();
        }
    }

    moveTetrominoLeft() {
        this.tetramino.column -= 1;
        if (!this.isValid()) {
            this.tetramino.column += 1;
        } else {
            this.calculateGhostPosition();
        }
    }

    moveTetrominoRight() {
        this.tetramino.column += 1;
        if (!this.isValid()) {
            this.tetramino.column -= 1;
        } else {
            this.calculateGhostPosition();
        }
    }

    rotateTetromino() {
        const oldMatrix = this.tetramino.matrix;
        const rotatedMatrix = rotateMatrix(this.tetramino.matrix);
        this.tetramino.matrix = rotatedMatrix;
        if (!this.isValid()) {
            this.tetramino.column = oldMatrix;
        } else {
            this.calculateGhostPosition();
        }
    }

    dropTetrominoDown() {
        this.tetramino.row = this.tetramino.ghostRow;
        this.placeTetromino();
    }

    isValid() {
        const matrixSize = this.tetramino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for (let column = 0; column < matrixSize; column++) {
                if (!this.tetramino.matrix[row][column]) continue;
                if (this.isOutsideOfGame(row, column)) return false;
                if (this.isCollides(row, column)) return false;
            }
        }
        return true;
    }

    isOutsideOfGame(row, column) {
        return this.tetramino.column + column < 0 ||
            this.tetramino.column + column >= PLAYFILED_COLUMNS ||
            this.tetramino.row + row >= this.playfield.length;
    }
    
    isCollides(row, column) {
        return this.playfield[this.tetramino.row + row]?.[this.tetramino.column + column];
    }

    placeTetromino() {
        const matrixSize = this.tetramino.matrix.length;
        for (let row = 0; row < matrixSize; row++) {
            for ( let column = 0; column < matrixSize; column++) {
                if (!this.tetramino.matrix[row][column]) continue;
                if (this.isOutsideOfTopBoard(row)) {
                    this.isGameOver = true;
                    return;
                }

                this.playfield[this.tetramino.row + row][this.tetramino.column + column] = this.tetramino.name;
            }
        }

        this.processFilledRows()
        this.generateTetramino();
    }

    isOutsideOfTopBoard(row) {
        return this.tetramino.row + row < 0;
    }

    processFilledRows() {
        const filledLines = this.findFilledRows();
        this.removeFilledRows(filledLines);
    }

    findFilledRows() {
        const filledRows = [];
        for (let row = 0; row < PLAYFILED_ROWS; row++) {
            if (this.playfield[row].every(cell => Boolean(cell))) {
                filledRows.push(row);
            }
        }

        return filledRows;
    }

    removeFilledRows(filledRows) {
        filledRows.forEach(row => {
            this.dropRowsAbove(row);
        });
    }

    dropRowsAbove(rowToDelete) {
        for (let row = rowToDelete; row > 0; row--) {
            this.playfield[row] = this.playfield[row - 1];
        }

        this.playfield[0] = new Array(PLAYFILED_COLUMNS).fill(0)
    }

    calculateGhostPosition() {
        const tetraminoRow = this.tetramino.row;
        this.tetramino.row++;
        while (this.isValid()) {
            this.tetramino.row++;
        }
        this.tetramino.ghostRow = this.tetramino.row - 1;
        this.tetramino.ghostColumn = this.tetramino.column;
        this.tetramino.row = tetraminoRow;
    }
}



export default Tetris