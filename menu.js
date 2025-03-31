const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const game = document.getElementById('game');
const leaderboard = document.getElementById('leaderboard');
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const player2TypeSelect = document.getElementById("player2Type");
const levelSelect = document.getElementById("level");

player2TypeSelect.addEventListener("change", function() {
    if (this.value === "player2") {
        player2NameInput.disabled = false;
    } else {
        player2NameInput.disabled = true;
        player2NameInput.value = "";
    }
    validateForm();
});

// untuk disable start button jika belum mengisi nama player
function validateForm() {
    if (player1NameInput.value.trim() !== "" && levelSelect.value !== "") {
        if(player2TypeSelect.value === "player2" && player2NameInput.value.trim() === ""){
            startBtn.disabled = true;
            return;
        }
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
}

player1NameInput.addEventListener("input", validateForm);
player2NameInput.addEventListener("input", validateForm);
levelSelect.addEventListener("change", validateForm);


startBtn.addEventListener("click", function() {
    // store nama player dan level
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2TypeSelect.value === "player2" ? player2NameInput.value.trim() : "Bot";
    const level = levelSelect.value;

    // start game
    initGame(player1Name, player2Name, level);

    // update player names
    document.getElementById("player1NameDisplay").textContent = player1Name + ":";
    document.getElementById("player2NameDisplay").textContent = player2Name + ":";

    menu.style.display = 'none';
    game.style.display = 'flex';
    leaderboard.style.marginTop = '100px';
});