let currentUser = null;

const games = [
  { id: 1, home: "Ajax", away: "Olympiacos", result: "" },
  { id: 2, home: "Arsenal", away: "Kairat Almaty", result: "" },
  { id: 3, home: "Monaco", away: "Juventus", result: "" },
  { id: 4, home: "Athletic Club", away: "Sporting CP", result: "" },
  { id: 5, home: "Atlético Madrid", away: "Bodø/Glimt", result: "" },
  { id: 6, home: "Leverkusen", away: "Villarreal", result: "" },
  { id: 7, home: "Borussia Dortmund", away: "Inter", result: "" },
  { id: 8, home: "Club Brugge", away: "Marseille", result: "" },
  { id: 9, home: "Frankfurt", away: "Tottenham Hotspur", result: "" },
  { id: 10, home: "Barcelona", away: "Copenhagen", result: "" },
  { id: 11, home: "Liverpool", away: "Qarabağ", result: "" },
  { id: 12, home: "Manchester City", away: "Galatasaray", result: "" },
  { id: 13, home: "Pafos", away: "Slavia Praha", result: "" },
  { id: 14, home: "Paris Saint-Germain", away: "Newcastle United", result: "" },
  { id: 15, home: "PSV Eindhoven", away: "Bayern München", result: "" },
  { id: 16, home: "Union Saint‑Gilloise", away: "Atalanta", result: "" },
  { id: 17, home: "Benfica", away: "Real Madrid", result: "" },
  { id: 18, home: "Napoli", away: "Chelsea", result: "" }
];

function login() {
  const name = document.getElementById("username").value.trim();
  if (!name) return;

  currentUser = name;
  document.querySelector(".login").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify({}));
  }

  renderGames();
  updateLeaderboard();
}

function renderGames() {
  const container = document.getElementById("games");
  container.innerHTML = "";

  const users = JSON.parse(localStorage.getItem("users"));
  if (!users[currentUser]) users[currentUser] = { tips: {}, points: 0 };

  games.forEach(game => {
    const tip = users[currentUser].tips[game.id] || "";

    const card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
      <div class="teams">${game.home} vs ${game.away}</div>
      <input placeholder="Dein Tipp z.B. 2:1" value="${tip}"
             oninput="saveTip(${game.id}, this.value)">
      <div class="result">Ergebnis: ${game.result}</div>
      <div class="points" id="points-${game.id}">Punkte: 0</div>
    `;

    container.appendChild(card);
  });

  localStorage.setItem("users", JSON.stringify(users));
  calculatePoints();
}

function saveTip(gameId, value) {
  const users = JSON.parse(localStorage.getItem("users"));
  users[currentUser].tips[gameId] = value;
  localStorage.setItem("users", JSON.stringify(users));
  calculatePoints();
}

function calculatePoints() {
  const users = JSON.parse(localStorage.getItem("users"));
  let total = 0;

  games.forEach(game => {
    const tip = users[currentUser].tips[game.id];
    let points = 0;

    if (tip === game.result) {
      points = 3;
    } else if (tip && (tip.split(":")[0] - tip.split(":")[1]) ===
               (game.result.split(":")[0] - game.result.split(":")[1])) {
      points = 1;
    }

    document.getElementById(`points-${game.id}`).innerText = "Punkte: " + points;
    total += points;
  });

  users[currentUser].points = total;
  localStorage.setItem("users", JSON.stringify(users));
  updateLeaderboard();
}

function updateLeaderboard() {
  const users = JSON.parse(localStorage.getItem("users"));
  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  Object.entries(users)
    .sort((a, b) => b[1].points - a[1].points)
    .forEach(([name, data]) => {
      const li = document.createElement("li");
      li.textContent = `${name}: ${data.points} Punkte`;
      board.appendChild(li);
    });
}
