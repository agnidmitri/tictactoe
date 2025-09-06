const board = Array(9).fill("");
let gameStarted = true;
const scores = {
  X: 0,
  O: 0,
  ties: 0,
};
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], //horizontal
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], //vertical
  [0, 4, 8],
  [2, 4, 6], //diagonal
];
let singlePlayer = true;
let multiPlayer = false;
let selectedGameMode = singlePlayer || multiPlayer;
const playerX = "✕";
const playerO = "◯";
let selectedPlayer = playerX || playerO;
let currentPlayer = selectedPlayer;

//DOM elements
const selectBoxGameMode = document.getElementById("selectBoxGameMode");
const singleBtn = document.getElementById("singlePlayer");
const multiBtn = document.getElementById("multiPlayer");
const selectBox = document.getElementById("selectBox");
const playerXBtn = document.getElementById("playerX");
const playerOBtn = document.getElementById("playerO");
const currentPlayerStatus = document.getElementById("currentPlayer");
const field = document.querySelectorAll(".field");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreTie = document.getElementById("scoreTie");
const newGameBtn = document.getElementById("newGame");
const resetScoreBtn = document.getElementById("resetScore");

//starting game
window.onload = () => {
  selectGameMode();
  selectPlayer();
};
//handles the selection of game mode
function selectGameMode() {
  singleBtn.onclick = () => {
    selectBoxGameMode.style.display = "none";
    singlePlayer = true;
    selectedGameMode = singlePlayer;
  };
  multiBtn.onclick = () => {
    selectBoxGameMode.style.display = "none";
    singlePlayer = false;
    multiPlayer = true;
    selectedGameMode = multiPlayer;
  };
}
//handles the selection of player
function selectPlayer() {
  playerXBtn.onclick = () => {
    selectBox.style.display = "none";
    currentPlayerStatus.textContent = `Player ${playerX}, it's your turn`;
    selectedPlayer = playerX;
    currentPlayer = selectedPlayer;
  };
  playerOBtn.onclick = () => {
    selectBox.style.display = "none";
    currentPlayerStatus.textContent = `Player ${playerO}, it's your turn`;
    selectedPlayer = playerO;
    currentPlayer = selectedPlayer;
  };
}
//handles the fields on the gameboard
function fieldClick(index) {
  if (!gameStarted || board[index] !== "") return;

  board[index] = currentPlayer;
  field[index].textContent = currentPlayer;
  field[index].disabled = true;
  field[index].style.cursor = "not-allowed";

  winCheck();

  // Only switch player and update status if game is still running
  if (gameStarted) {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
    currentPlayerStatus.textContent = `Player ${currentPlayer}, it's your turn`;
    //single player, houseBot
    if (singlePlayer) {
      houseBot();
    }
  }
}

// Add event listeners to each field button
field.forEach((btn, idx) => {
  btn.onclick = () => fieldClick(idx);
});
//handles the bot in single player mode
function houseBot() {
  const botPlayer = selectedPlayer === playerX ? playerO : playerX;
  if (currentPlayer !== botPlayer) return;

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];
    if (
      values.filter((v) => v === botPlayer).length === 2 &&
      values.includes("")
    ) {
      const emptyIndex = pattern[values.indexOf("")];
      fieldClick(emptyIndex);
      return;
    }
  }
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];
    const player = selectedPlayer;
    if (
      values.filter((v) => v === player).length === 2 &&
      values.includes("")
    ) {
      const emptyIndex = pattern[values.indexOf("")];
      fieldClick(emptyIndex);
      return;
    }
  }
  if (board[4] === "") {
    fieldClick(4);
    return;
  }
  const corners = [0, 2, 6, 8].filter((i) => board[i] === "");
  if (corners.length > 0) {
    fieldClick(corners[Math.floor(Math.random() * corners.length)]);
    return;
  }
  const emptyFields = board
    .map((v, i) => (v === "" ? i : null))
    .filter((i) => i !== null);
  if (emptyFields.length > 0) {
    fieldClick(emptyFields[0]);
  }
}
//checks for win patterns and sets the new score
function winCheck() {
  let winner = null;

  // Check all win patterns
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      winner = board[a];
      break;
    }
  }

  if (winner) {
    gameStarted = false;

    // Multiplayer mode
    if (multiPlayer) {
      currentPlayerStatus.textContent = `Player ${winner} wins!`;
    }
    // Single player mode
    else if (singlePlayer) {
      const botPlayer = selectedPlayer === playerX ? playerO : playerX;
      if (winner === selectedPlayer) {
        currentPlayerStatus.textContent = `Player ${winner} wins!`;
      } else if (winner === botPlayer) {
        currentPlayerStatus.textContent = `The house always wins.`;
      }
    }

    // Update scores
    if (winner === playerX) {
      scores.X++;
      scoreX.textContent = scores.X;
    } else if (winner === playerO) {
      scores.O++;
      scoreO.textContent = scores.O;
    }

    // Start new round after short delay
    setTimeout(() => {
      resetBoard();
    }, 3000);
  } else if (board.every((cell) => cell !== "")) {
    // Tie
    gameStarted = false;
    currentPlayerStatus.textContent = `It's a tie!`;
    scores.ties++;
    if (scoreTie) scoreTie.textContent = scores.ties;

    setTimeout(() => {
      resetBoard();
    }, 1500);
  }
}
// Helper to reset the board for a new round
function resetBoard() {
  board.fill("");
  field.forEach((btn) => {
    btn.textContent = "";
    btn.disabled = false;
    btn.style.cursor = "pointer";
  });
  gameStarted = true;
  currentPlayer = selectedPlayer;
  currentPlayerStatus.textContent = `Player ${currentPlayer}, it's your turn`;
}
//checks for tie patterns and sets the new score
function tiesCheck() {
  // If all fields are filled and no winner
  if (board.every((cell) => cell !== "")) {
    gameStarted = false;
    currentPlayerStatus.textContent = `It's a tie!`;
    scores.ties++;
    if (scoreTie) scoreTie.textContent = scores.ties;

    setTimeout(() => {
      resetBoard();
    }, 3000);
  }
}
//reloads the page and resets the game
newGameBtn.onclick = newGame;

function newGame() {
  location.reload();
}
//reset the score but keeps on the same trial
function resetScore() {
  // Reset scores
  scores.X = 0;
  scores.O = 0;
  scores.ties = 0;

  // Update scoreboard display
  if (scoreX) scoreX.textContent = scores.X;
  if (scoreO) scoreO.textContent = scores.O;
  if (scoreTie) scoreTie.textContent = scores.ties;

  // Reset board
  resetBoard();
}

// Attach to button
resetScoreBtn.onclick = resetScore;
