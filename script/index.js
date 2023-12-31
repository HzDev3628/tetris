import Tetris from "./module/tetris.js";
import { PLAYFILED_COLUMNS, PLAYFILED_ROWS, SAD, convertPositionToIndex } from "./module/utilites.js";

let hammer;
let requstId;
let timeoutId;

const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');

initKeyDown();
initToch();

moveDown();

function initKeyDown() {
    document.addEventListener('keydown', onKeydown);
}

function onKeydown(event) {
    switch (event.key) {
        case 'ArrowUp':
            rotate();
            break;

        case 'ArrowDown':
            moveDown();
            break;

        case 'ArrowLeft':
            moveLeft();
            break;

        case 'ArrowRight':
            moveRight();
            break;

        case ' ':
            dropDown();
            break;
    
        default:
            break;
    }
}

function initToch() {
    document.addEventListener('dblclick', (event) => {
        event.preventDefault();
    });

    hammer = new Hammer(document.querySelector('body'));
    hammer.get('pan').set({direction: Hammer.DIRECTION_ALL});
    hammer.get('swipe').set({direction: Hammer.DIRECTION_ALL});

    const threshould = 30;
    let deltaX = 0;
    let deltaY = 0;

    hammer.on('panstart', () => {
        deltaX = 0;
        deltaY = 0;
    });

    hammer.on('panleft', (event) => {
        if (Math.abs(event.deltaX - deltaX) > threshould) {
            moveLeft();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('panright', (event) => {
        if (Math.abs(event.deltaX - deltaX) > threshould) {
            moveRight();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('pandown', (event) => {
        if (Math.abs(event.deltaY - deltaY) > threshould) {
            moveDown();
            deltaX = event.deltaX;
            deltaY = event.deltaY;
        }
    });

    hammer.on('swipedown', (event) => {
        dropDown();
    });

    hammer.on('tap', (event) => {
        rotate();
    });
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function dropDown() {
    tetris.dropTetrominoDown();
    draw();
    stopLoop();
    startLoop();

    if (tetris.isGameOver) {
        gameOver();
    }
}

function startLoop() {
    timeoutId = setTimeout(() => requestAnimationFrame(moveDown), 700);
}

function stopLoop() {
    cancelAnimationFrame(requstId);
    clearTimeout(timeoutId);
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayfield();
    drawTetromino();
    drawGhostTetromino();
}

function drawPlayfield() {
    for (let row = 0; row < PLAYFILED_ROWS; row++) {
        for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
            if (!tetris.playfield[row][column]) continue;
            const name = tetris.playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetris.tetramino.name;
    const tetraminoMatrixSize = tetris.tetramino.matrix.length;
    for (let row = 0; row < tetraminoMatrixSize; row++) {
        for (let column = 0; column < tetraminoMatrixSize; column++) {
            if (!tetris.tetramino.matrix[row][column]) continue;
            if (tetris.tetramino.row + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetramino.row + row, tetris.tetramino.column + column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawGhostTetromino() {
    const tetraminoMatrixSize = tetris.tetramino.matrix.length;
    for (let row = 0; row < tetraminoMatrixSize; row++) {
        for (let column = 0; column < tetraminoMatrixSize; column++) {
            if (!tetris.tetramino.matrix[row][column]) continue;
            if (tetris.tetramino.ghostRow + row < 0) continue;
            const cellIndex = convertPositionToIndex(tetris.tetramino.ghostRow + row, tetris.tetramino.ghostColumn + column);
            cells[cellIndex].classList.add('ghost');
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onKeydown);
    hammer.off('panstart panleft panright pandown swipedown tap');
    gameOverAnimation();
}

function gameOverAnimation() {
    const filledCells = [...cells].filter(cell => cell.classList.length > 0);
    filledCells.forEach((cell, i) => {
        setTimeout(() => cell.classList.add('hide'), i * 10);
        setTimeout(() => cell.removeAttribute('class'), i * 10 + 500);
    });

    setTimeout(drawSad, filledCells.length * 10 + 1000);
}

function drawSad() {
    const TOP_OFFSET = 5;
    for (let row = 0; row < SAD.length; row++) {
        for (let column = 0; column < SAD[0].length; column++) {
            if (!SAD[row][column]) continue;
            const cellIndex = convertPositionToIndex(TOP_OFFSET + row, column);
            cells[cellIndex].classList.add('sad');
        }
    }
}