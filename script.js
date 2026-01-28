let currentUser = null;

const games = [
  { id: 1, home: "Real Madrid", away: "Manchester City", result: "2:1" },
  { id: 2, home: "Bayern München", away: "Arsenal", result: "1:1" },
  { id: 3, home: "PSG", away: "Barcelona", result: "0:2" }
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
