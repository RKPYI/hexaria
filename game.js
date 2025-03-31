const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 740;
canvas.height = 540;

let board = [];
let rows = 8;
let cols = [10, 9, 10, 9, 10, 9, 10, 9, 10, 9];
let hexagonRadius = 40;
let hexagonBorderColor = "#ccc";
let hexagonFillColor = '#222';
let textColor = 'white';
let disabledHexagonColor = 'gray';

let player1Name = "";
let player2Name = "";
let level = "easy";
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let gameBoard = [];
let currentTurnValue = null;
let placeSound = document.getElementById("placeSound");
let disabledHexagonsCount = { easy: 4, medium: 6, hard: 8 };

let hoveredHexagon = null;


function initGame(p1Name, p2Name, lvl) {
    player1Name = p1Name;
    player2Name = p2Name;
    level = lvl;
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    gameBoard = [];
    currentTurnValue = getRandomValue(); // value pertama dimulai
    updateCurrentTurnDisplay();
    document.getElementById("player1Score").textContent = player1Score;
    document.getElementById("player2Score").textContent = player2Score;

    createBoard();
    drawBoard();
}

function createBoard() {
    board = [];
    gameBoard = [];
    for (let row = 0; row < rows; row++) {
        let colsForRow = cols[row];
        let xOffset = row % 2 === 0 ? 55 : 90;
        let yOffset = 50 + (60 * row);

        for (let i = 0; i < colsForRow; i++) {
            let x = xOffset + (70 * i);
            let y = yOffset;
            board.push({ x, y, row, col: i, value: null, owner: null, disabled: false });
            gameBoard.push({ x, y, row, col: i, value: null, owner: null, disabled: false });

        }
    }

    // disable hexagon sesuai level
    let disabledCount = disabledHexagonsCount[level];
    for (let i = 0; i < disabledCount; i++) {
        let randomIndex = Math.floor(Math.random() * gameBoard.length);
        gameBoard[randomIndex].disabled = true;
    }
}


function drawBoard() {
    drawBackground();
    gameBoard.forEach(hexagon => {
        drawHexagon(hexagon.x, hexagon.y, hexagonRadius, hexagon.owner, hexagon.value, hexagon.disabled);
    });

    if (hoveredHexagon && !hoveredHexagon.owner && !hoveredHexagon.disabled) {
        drawHexagon(hoveredHexagon.x, hoveredHexagon.y, hexagonRadius, currentPlayer === 1 ? 1 : 2, currentTurnValue, hoveredHexagon.disabled, true); // placeholder
    }
}

function drawBackground() {
    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawHexagon(x, y, radius, owner, value = null, disabled = false, isPlaceholder = false) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const pointX = x + radius * Math.cos(angle);
        const pointY = y + radius * Math.sin(angle);

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.closePath();

    if (disabled) {
        ctx.fillStyle = disabledHexagonColor;
    } else if (owner === 1) {
        ctx.fillStyle = 'red';
    } else if (owner === 2) {
        ctx.fillStyle = 'blue';
    }
    else {
        ctx.fillStyle = hexagonFillColor;
    }

    ctx.fill();

    ctx.strokeStyle = hexagonBorderColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (value !== null) {
        ctx.fillStyle = textColor;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value.toString(), x, y);
    }

    if (isPlaceholder) {
        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            const pointX = x + radius * Math.cos(angle);
            const pointY = y + radius * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.closePath();

        if (owner === 1) {
            ctx.fillStyle = 'red';
        } else if (owner === 2) {
            ctx.fillStyle = 'blue';
        }

        ctx.fill();

        ctx.strokeStyle = hexagonBorderColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (value !== null) {
            ctx.fillStyle = textColor;
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(value.toString(), x, y);
        }


        ctx.globalAlpha = 1.0; // reset opacity
    }
}

// random value 1-20
function getRandomValue() {
    return Math.floor(Math.random() * 20) + 1;
}

function updateCurrentTurnDisplay() {
    const color = currentPlayer === 1 ? "red" : "blue";
    document.getElementById("currentTurnValue").textContent = `${currentTurnValue} (${color})`;
}

canvas.addEventListener('click', function(event) {
    handleClick(event);
});

canvas.addEventListener('mousemove', function(event) {
    handleMouseMove(event);
});

canvas.addEventListener('mouseout', function() {
    hoveredHexagon = null;
    drawBoard();
});

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // cari hexagon yang di klik
    const clickedHexagon = findClickedHexagon(x, y);

    if (clickedHexagon && !clickedHexagon.owner && !clickedHexagon.disabled) {
        // taruh hexagon
        placeHexagon(clickedHexagon);
    }
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    hoveredHexagon = findClickedHexagon(x, y);
    drawBoard();
}


function findClickedHexagon(x, y) {
    for (let i = 0; i < gameBoard.length; i++) {
        const hexagon = gameBoard[i];
        const distance = Math.sqrt(Math.pow(x - hexagon.x, 2) + Math.pow(y - hexagon.y, 2));
        if (distance < hexagonRadius) {
            return hexagon;
        }
    }
    return null;
}

function placeHexagon(hexagon) {
    hexagon.owner = currentPlayer;
    hexagon.value = currentTurnValue; // taruh value hexagon
    playSound();
    drawBoard(); // gambar board lagi

    takeOverHexagons(hexagon);

    // tambah value hexagon yang sejajar
    addUpAdjacentHexagons(hexagon);

    updateScores();

    switchPlayer();

    // cek gameover atau tidak
    if (isGameOver()) {
        showGameOverModal();
        return;
    }

    // generate value selanjutnya
    currentTurnValue = getRandomValue();
    updateCurrentTurnDisplay();

    // jika turn bot, maka jalankan botMove
    if (player2Name === "Bot" && currentPlayer === 2) {
        setTimeout(botMove, 1000); // delay 1 detik
    }
}

function playSound() {
    placeSound.currentTime = 0;
    placeSound.play();
}

function takeOverHexagons(hexagon) {
    const adjacentHexagons = getAdjacentHexagons(hexagon);

    adjacentHexagons.forEach(adjHexagon => {
        if (adjHexagon.owner !== null && adjHexagon.owner !== currentPlayer && adjHexagon.value < hexagon.value) {
            adjHexagon.owner = currentPlayer;
        }
    });
    drawBoard();
}

function addUpAdjacentHexagons(hexagon) {
    const adjacentHexagons = getAdjacentHexagons(hexagon);

    adjacentHexagons.forEach(adjHexagon => {
        if (adjHexagon.owner === currentPlayer) {
            adjHexagon.value += 1;
        }
    });
    drawBoard();
}

function getAdjacentHexagons(hexagon) {
    const adjacentHexagons = [];
    const { x, y } = hexagon;

    // Define the possible adjacent hexagon coordinates
    const adjacentCoordinates = [
        { dx: 0, dy: -60 },           // Top
        { dx: 0, dy: 60 },            // Bottom
        { dx: -70, dy: 0 },          // Left
        { dx: 70, dy: 0 },           // Right
        { dx: -35, dy: -30 },      // Top-Left
        { dx: 35, dy: -30 },       // Top-Right
        { dx: -35, dy: 30 },       // Bottom-Left
        { dx: 35, dy: 30 }        // Bottom-Right
    ];

    adjacentCoordinates.forEach(({ dx, dy }) => {
        const adjX = x + dx;
        const adjY = y + dy;

        const adjacentHexagon = gameBoard.find(hex => hex.x === adjX && hex.y === adjY);
        if (adjacentHexagon) {
            adjacentHexagons.push(adjacentHexagon);
        }
    });

    console.log(adjacentHexagons);
    return adjacentHexagons;
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateScores() {
    player1Score = gameBoard.filter(hex => hex.owner === 1).reduce((sum, hex) => sum + hex.value, 0);
    player2Score = gameBoard.filter(hex => hex.owner === 2).reduce((sum, hex) => sum + hex.value, 0);

    document.getElementById("player1Score").textContent = player1Score;
    document.getElementById("player2Score").textContent = player2Score;
}

function isGameOver() {
    return gameBoard.every(hexagon => hexagon.owner !== null || hexagon.disabled);
}

function showGameOverModal() {
    const winner = player1Score > player2Score ? player1Name : player2Name;
    const winnerScore = Math.max(player1Score, player2Score);
    const modal = document.getElementById("gameOverModal");
    document.getElementById("winnerName").textContent = winner;
    document.getElementById("winnerScore").textContent = winnerScore;
    document.getElementById("gameOverMessage").textContent = "Game Over!";
    modal.style.display = "flex";

    // simpan score ke leaderboard
    saveScore(player1Name, player2Name, player1Score, player2Score, winner);
}

// function botMove() {
//     // cari hexagon yang kosong
//     const emptyHexagons = gameBoard.filter(hexagon => hexagon.owner === null && !hexagon.disabled);

//     if (emptyHexagons.length > 0) {
//         // pilih hexagon
//         const randomIndex = Math.floor(Math.random() * emptyHexagons.length);
//         const hexagon = emptyHexagons[randomIndex];

//         // taruh hexagon
//         placeHexagon(hexagon);
//     }
// }

async function botMove() {
    // cari hexagon yang kosong
    const emptyHexagons = gameBoard.filter(hexagon => hexagon.owner === null && !hexagon.disabled);

    if (emptyHexagons.length > 0) {
        // pilih 3 hexagon
        const chosenHexagons = [];
        for (let i = 0; i < Math.min(3, emptyHexagons.length); i++) {
            const randomIndex = Math.floor(Math.random() * emptyHexagons.length);
            chosenHexagons.push(emptyHexagons[randomIndex]);
            emptyHexagons.splice(randomIndex, 1); // hapus duplikat
        }

        // tampilkan animasi hover
        for (const hexagon of chosenHexagons) {
            hoveredHexagon = hexagon;
            drawBoard();
            await delay(350);
        }

        // pilih hexagon terakhir dan taruh
        const lastHexagon = chosenHexagons.pop() || gameBoard.filter(hexagon => hexagon.owner === null && !hexagon.disabled)[0];
        hoveredHexagon = null; // clear hover
        drawBoard();
        if (lastHexagon) {
            placeHexagon(lastHexagon);
        }
    }
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const newGameBtn = document.getElementById("newGameBtn");

newGameBtn.addEventListener("click", function() {
    // reset game state
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    gameBoard = [];
    drawBoard();

    // hide gameboard dan tampilkan menu
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('leaderboard').style.marginTop = '0';
});

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("gameOverModal").style.display = "none";
    document.getElementById('game').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    document.getElementById('leaderboard').style.marginTop = '0';
});

document.getElementById("restartBtn").addEventListener("click", function () {
    // reset game state
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    gameBoard = [];
    drawBoard();

    document.getElementById("gameOverModal").style.display = "none";
    initGame(player1Name, player2Name, level);
})