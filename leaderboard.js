const leaderboardList = document.getElementById("leaderboardList");
const sortBySelect = document.getElementById("sortBy");
let leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];

function saveScore(player1Name, player2Name, player1Score, player2Score, winner) {
    const score = {
        player1Name: player1Name,
        player2Name: player2Name,
        player1Score: player1Score,
        player2Score: player2Score,
        winner: winner,
        date: new Date().toISOString()
    };

    leaderboardData.push(score);
    leaderboardData.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date initially
    localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));
    displayLeaderboard();
}

function displayLeaderboard() {
    leaderboardList.innerHTML = "";
    leaderboardData.forEach(score => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${score.player1Name} vs ${score.player2Name} - ${score.player1Score} - ${score.player2Score}
            <button onclick="showDetails('${score.player1Name}', '${score.player2Name}', '${score.player1Score}', '${score.player2Score}', '${score.winner}', '${score.date}')">Details</button>
        `;
        leaderboardList.appendChild(listItem);
    });
}

function showDetails(player1Name, player2Name, player1Score, player2Score, winner, date) {
    alert(`Details:\nPlayer 1: ${player1Name} (${player1Score})\nPlayer 2: ${player2Name} (${player2Score})\nWinner: ${winner}\nDate: ${new Date(date).toLocaleString()}`);
}

sortBySelect.addEventListener("change", function() {
    const sortBy = this.value;
    if (sortBy === "score") {
        leaderboardData.sort((a, b) => Math.max(b.player1Score, b.player2Score) - Math.max(a.player1Score, a.player2Score));
    } else if (sortBy === "date") {
        leaderboardData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    displayLeaderboard();
});

displayLeaderboard(); 