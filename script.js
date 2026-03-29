let board = document.getElementById("board");
let movesText = document.getElementById("moves");
let timeText = document.getElementById("time");
let bestText = document.getElementById("best");
let popup = document.getElementById("popup");
let result = document.getElementById("result");

let symbols = [
  "🍎","🍌","🍇","🍒","🍉","🍍","🥝","🍓",
  "🥥","🍑","🍋","🍊","🍏","🥕","🍆","🌽"
];

let cards = [];
let flipped = [];
let moves = 0;
let time = 0;
let timer;

// 🚀 Start Game
function startGame() {
  board.innerHTML = ""; // clear board
  popup.style.display = "none"; // hide popup

  let size = parseInt(document.getElementById("difficulty").value);
  board.style.gridTemplateColumns = `repeat(${size}, 80px)`;

  let needed = (size * size) / 2;
  cards = [...symbols.slice(0, needed), ...symbols.slice(0, needed)];
  cards.sort(() => 0.5 - Math.random());

  flipped = [];
  moves = 0;
  time = 0;

  movesText.innerText = moves;
  timeText.innerText = time;

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    timeText.innerText = time;
  }, 1000);

  loadBest();

  // Create Cards
  cards.forEach((symbol) => {
    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="inner">
        <div class="front"></div>
        <div class="back">${symbol}</div>
      </div>
    `;

    card.dataset.symbol = symbol;
    card.addEventListener("click", () => flipCard(card));
    board.appendChild(card);
  });
}

// 🎴 Flip Card
function flipCard(card) {
  if (
    flipped.length < 2 &&
    !card.classList.contains("flipped") &&
    !card.classList.contains("matched")
  ) {
    card.classList.add("flipped");
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      movesText.innerText = moves;
      checkMatch();
    }
  }
}

// 🔍 Check Match
function checkMatch() {
  let [c1, c2] = flipped;

  if (c1.dataset.symbol === c2.dataset.symbol) {
    c1.classList.add("matched");
    c2.classList.add("matched");
    flipped = [];

    if (document.querySelectorAll(".matched").length === cards.length) {
      winGame();
    }
  } else {
    setTimeout(() => {
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
      flipped = [];
    }, 800);
  }
}

// 🏆 Win Game
function winGame() {
  clearInterval(timer);
  popup.style.display = "flex";

  result.innerText = `⏱️ Time: ${time}s  |  🎯 Moves: ${moves}`;
  saveBest();
}

// 💾 Save Best Score
function saveBest() {
  let best = parseInt(localStorage.getItem("bestScore"));

  if (!best || time < best) {
    localStorage.setItem("bestScore", time);
  }

  loadBest();
}

// 📊 Load Best Score
function loadBest() {
  let best = localStorage.getItem("bestScore");
  bestText.innerText = best ? best + "s" : "--";
}

// 🔄 Restart Game (FIXED)
function restartGame() {
  clearInterval(timer);
  startGame();
}

// 🎮 Start on Load
startGame();