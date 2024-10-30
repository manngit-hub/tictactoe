const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] || !gameActive || currentPlayer !== "X") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add("disabled", currentPlayer.toLowerCase());

  if (checkWin()) {
    gameActive = false;
    statusElement.textContent = `${currentPlayer} wins!`;
    highlightWinningCells();
    return;
  } else if (board.every(cell => cell)) {
    gameActive = false;
    statusElement.textContent = "It's a draw!";
    return;
  }

  currentPlayer = "O";
  statusElement.textContent = "AI's turn";
  setTimeout(aiMove, 500);
}

function aiMove() {
  if (!gameActive) return;

  const bestMove = findBestMove();
  board[bestMove] = "O";
  const cell = document.querySelector(`[data-index="${bestMove}"]`);
  cell.textContent = "O";
  cell.classList.add("disabled", "o");

  if (checkWin()) {
    gameActive = false;
    statusElement.textContent = "O wins!";
    highlightWinningCells();
    return;
  } else if (board.every(cell => cell)) {
    gameActive = false;
    statusElement.textContent = "It's a draw!";
    return;
  }

  currentPlayer = "X";
  statusElement.textContent = "Your turn!";
}

function findBestMove() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";
      if (checkWin()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "X";
      if (checkWin()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin() {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function highlightWinningCells() {
  winningCombinations.forEach(combination => {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.querySelector(`[data-index="${a}"]`).classList.add("winning");
      document.querySelector(`[data-index="${b}"]`).classList.add("winning");
      document.querySelector(`[data-index="${c}"]`).classList.add("winning");
    }
  });
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  gameActive = true;
  statusElement.textContent = "Your turn!";
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("disabled", "x", "o", "winning");
  });
}

boardElement.addEventListener("click", handleClick);
