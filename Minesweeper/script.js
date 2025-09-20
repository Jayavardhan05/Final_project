const boardSize = 5;
const mineCount = 5;
let board = [];
let revealedCount = 0;
let score = 0;
let gameOver = false;

const boardElement = document.getElementById("game-board");
const statusElement = document.getElementById("status");
const scoreElement = document.getElementById("score");

function initGame() {
    board = [];
    revealedCount = 0;
    score = 0;
    gameOver = false;
    boardElement.innerHTML = '';
    statusElement.textContent = '';
    scoreElement.textContent = "Tiles Cleared: 0";

    for (let i = 0; i < boardSize * boardSize; i++) {
        board.push({ mine: false, revealed: false, element: null });
    }

    let placedMines = 0;
    while (placedMines < mineCount) {
        const index = Math.floor(Math.random() * board.length);
        if (!board[index].mine) {
            board[index].mine = true;
            placedMines++;
        }
    }

    board.forEach((cell, index) => {
        const div = document.createElement("div");
        div.classList.add("cell");
        div.addEventListener("click", () => revealCell(index));
        boardElement.appendChild(div);
        cell.element = div;
    });
}

function revealCell(index) {
    if (gameOver || board[index].revealed) return;

    const cell = board[index];
    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.mine) {
        cell.element.classList.add("mine");
        cell.element.textContent = '💣';
        endGame(false);
    } else {
        const count = countAdjacentMines(index);
        cell.element.textContent = count > 0 ? count : '';
        revealedCount++;
        score++;
        document.getElementById("score").textContent = "Tiles Cleared: " + score;

        if (revealedCount === boardSize * boardSize - mineCount) {
            endGame(true);
        }
    }
}

function countAdjacentMines(index) {
    const x = index % boardSize;
    const y = Math.floor(index / boardSize);
    let count = 0;

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize) {
                const newIndex = ny * boardSize + nx;
                if (board[newIndex].mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function endGame(won) {
    gameOver = true;
    document.getElementById("status").textContent = won ? "You Win!" : "Game Over!";

    board.forEach(cell => {
        if (cell.mine && !cell.revealed) {
            cell.element.textContent = '💣';
            cell.element.classList.add('mine');
        }
    });
}

function resetGame() {
    initGame();
}

window.onload = initGame;