const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
const TETROMINO_NAMES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];

const TETROMINOES = {
    'I': [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],

    'J': [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],

    'L': [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],

    'O': [
      [1, 1],
      [1, 1],
    ],

    'S': [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],

    'Z': [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],

    'T': [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]
};

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function convertPositionToIndex(row, column) {
  return row * PLAYFILED_COLUMNS + column;
}

function rotateMatrix(matrix) {
  const N = matrix.length;
  const rotateMatrix = [];
  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrix[N - j - 1][i];
    }
  }

  return rotateMatrix;
}

const SAD = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
]; 

export {
  PLAYFILED_COLUMNS,
  PLAYFILED_ROWS, 
  TETROMINO_NAMES,
  TETROMINOES,
  getRandomElement,
  convertPositionToIndex,
  rotateMatrix,
  SAD
}