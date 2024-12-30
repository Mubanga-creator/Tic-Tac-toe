// HTML structure for the game board
const container = document.createElement('div');
container.id = 'board';
document.body.appendChild(container);

const playerTurnDisplay = document.createElement('h3');
playerTurnDisplay.id = 'player-turn';
playerTurnDisplay.innerText = "Player X's Turn";
document.body.appendChild(playerTurnDisplay);

const messageDisplay = document.createElement('div');
messageDisplay.id = 'message';
messageDisplay.style.textAlign = 'center';
messageDisplay.style.marginTop = '10px';
messageDisplay.style.color = 'red';
document.body.appendChild(messageDisplay);

const resetButton = document.createElement('button');
resetButton.innerText = 'Reset Game';
resetButton.style.display = 'block';
resetButton.style.margin = '20px auto';
resetButton.addEventListener('click', resetGame);
document.body.appendChild(resetButton);

// Initialize game variables
const boardSize = 3;
let currentPlayer = 'X';
const moves = { X: [], O: [] };
const maxMoves = 3;

// Define image paths
const playerImages = {
    X: 'images/icons8-cross-90.png', 
    O: 'images/icons8-circle-90.png'  
};

// Create the game board
function createBoard() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleMove);
            container.appendChild(cell);
        }
    }
}

// Handle a player's move
function handleMove(event) {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (cell.style.backgroundImage) {
        messageDisplay.innerText = 'Cell already occupied!';
        return;
    }

    // Add the move
    moves[currentPlayer].push({ row, col });

    // Remove oldest move if exceeding maxMoves
    if (moves[currentPlayer].length > maxMoves) {
        const oldestMove = moves[currentPlayer].shift();
        const oldestCell = document.querySelector(
            `.cell[data-row='${oldestMove.row}'][data-col='${oldestMove.col}']`
        );
        oldestCell.style.backgroundImage = ''; // Clear the background image
        oldestCell.style.opacity = '1'; // Reset opacity
    }

    // Add the player's image to the cell
    cell.style.backgroundImage = `url('${playerImages[currentPlayer]}')`;
    cell.style.backgroundSize = 'contain';
    cell.style.backgroundRepeat = 'no-repeat';
    cell.style.backgroundPosition = 'center';

    // Highlight the oldest move by reducing opacity
    if (moves[currentPlayer].length === maxMoves) {
        const oldestMove = moves[currentPlayer][0];
        const oldestCell = document.querySelector(
            `.cell[data-row='${oldestMove.row}'][data-col='${oldestMove.col}']`
        );
        oldestCell.style.opacity = '0.5';
    }

    // Check for a winner
    if (checkWinner(currentPlayer)) {
        messageDisplay.innerText = `Player ${currentPlayer} wins!`;
        disableBoard();
        return;
    }

    // Check for a draw
    if (isBoardFull()) {
        messageDisplay.innerText = 'It\'s a draw!';
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerTurnDisplay.innerText = `Player ${currentPlayer}'s Turn`;
    messageDisplay.innerText = '';
}

// Check for a winner
function checkWinner(player) {
    const playerMoves = moves[player];
    const winningCombinations = [
        // Rows
        [
            { row: '0', col: '0' },
            { row: '0', col: '1' },
            { row: '0', col: '2' }
        ],
        [
            { row: '1', col: '0' },
            { row: '1', col: '1' },
            { row: '1', col: '2' }
        ],
        [
            { row: '2', col: '0' },
            { row: '2', col: '1' },
            { row: '2', col: '2' }
        ],
        // Columns
        [
            { row: '0', col: '0' },
            { row: '1', col: '0' },
            { row: '2', col: '0' }
        ],
        [
            { row: '0', col: '1' },
            { row: '1', col: '1' },
            { row: '2', col: '1' }
        ],
        [
            { row: '0', col: '2' },
            { row: '1', col: '2' },
            { row: '2', col: '2' }
        ],
        // Diagonals
        [
            { row: '0', col: '0' },
            { row: '1', col: '1' },
            { row: '2', col: '2' }
        ],
        [
            { row: '0', col: '2' },
            { row: '1', col: '1' },
            { row: '2', col: '0' }
        ]
    ];

    return winningCombinations.some(combination =>
        combination.every(move =>
            playerMoves.some(playerMove =>
                playerMove.row === move.row && playerMove.col === move.col
            )
        )
    );
}

// Check if the board is full
function isBoardFull() {
    return document.querySelectorAll('.cell').length === document.querySelectorAll('.cell[style*="background-image"]').length;
}

// Disable the board
function disableBoard() {
    document.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleMove));
}

// Reset the game
function resetGame() {
    moves.X = [];
    moves.O = [];
    currentPlayer = 'X';
    playerTurnDisplay.innerText = "Player X's Turn";
    messageDisplay.innerText = '';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.backgroundImage = '';
        cell.style.opacity = '1';
        cell.addEventListener('click', handleMove);
    });
}

// Styles for the game board
const style = document.createElement('style');
style.innerText = `
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    flex-direction: column;
  }
  #board {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);
    gap: 5px;
    margin: 20px 0;
  }
  .cell {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #000;
    cursor: pointer;
  }
  .cell:hover {
    background-color: #f0f0f0;
  }
  h3 {
    text-align: center;
  }
  #message {
    font-size: 16px;
    font-weight: bold;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
`;
document.head.appendChild(style);

// Start the game
createBoard();

