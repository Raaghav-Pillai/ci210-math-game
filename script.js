// script.js
let currentPlayer = 1;
let player1HP = 100;
let player2HP = 100;
let timeLeft = 30;
let timer;
let correctAnswer = 0;
let selectedClass = "";
let questionBank = [];

const classes = [
  "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

function goToClassScreen() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("class-screen").style.display = "flex";
  generateClassButtons();
}

function generateClassButtons() {
  const container = document.getElementById("class-buttons");
  container.innerHTML = "";
  classes.forEach(cls => {
    const btn = document.createElement("button");
    btn.textContent = cls;
    btn.className = "button";
    btn.onclick = () => loadQuestionsForClass(cls);
    container.appendChild(btn);
  });
}

function loadQuestionsForClass(cls) {
  selectedClass = cls;
  Papa.parse("questions.csv", {
    download: true,
    header: true,
    complete: function(results) {
      questionBank = results.data.filter(q => q.class === selectedClass);
      if (questionBank.length === 0) {
        alert("No questions found for this class.");
        return;
      }

      document.getElementById("class-screen").style.display = "none";
      document.getElementById("game-screen").style.display = "block";

      const music = document.getElementById("bg-music");
      music.volume = 0.4;
      music.play().catch(() => {});

      resetHealthBars();
      startTurn();
    }
  });
}

function startTurn() {
  document.getElementById("answer-input").value = "";
  document.getElementById("player-turn").innerText = `Player ${currentPlayer}'s Turn`;
  document.getElementById("feedback").textContent = "";
  timeLeft = 30;
  updateTimerDisplay();
  generateQuestion();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) endTurn();
  }, 1000);
}

function updateTimerDisplay() {
  document.getElementById("timer").innerText = `Time: ${timeLeft}`;
}

function generateQuestion() {
  const rand = Math.floor(Math.random() * questionBank.length);
  const q = questionBank[rand];
  document.getElementById("question").innerText = q.question;
  correctAnswer = q.answer.trim();
}

function submitAnswer() {
  const userAnswer = document.getElementById("answer-input").value.trim();
  const p1 = document.getElementById("player1-img");
  const p2 = document.getElementById("player2-img");
  const feedback = document.getElementById("feedback");

  if (userAnswer === correctAnswer) {
    feedback.textContent = "";
    if (currentPlayer === 1) {
      player2HP -= 5;
      updateHealthBar("player2-health", player2HP);
      p1.src = "assets/player1-punch.png";
      setTimeout(() => p1.src = "assets/player1.png", 400);
      if (player2HP <= 0) return endGame(1);
    } else {
      player1HP -= 5;
      updateHealthBar("player1-health", player1HP);
      p2.src = "assets/player2-punch.png";
      setTimeout(() => p2.src = "assets/player2.png", 400);
      if (player1HP <= 0) return endGame(2);
    }
    generateQuestion();
  } else {
    feedback.textContent = `❌ Correct answer was ${correctAnswer}`;
    if (currentPlayer === 1) {
      p1.src = "assets/player1-stun.png";
      setTimeout(() => p1.src = "assets/player1.png", 400);
    } else {
      p2.src = "assets/player2-stun.png";
      setTimeout(() => p2.src = "assets/player2.png", 400);
    }

    clearInterval(timer); // Pause timer
    setTimeout(() => {
      feedback.textContent = "";
      endTurn(); // After 1.5s, continue game
    }, 1500);
  }

  document.getElementById("answer-input").value = "";
}

function endTurn() {
  clearInterval(timer);
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  setTimeout(startTurn, 500);
}

function endGame(winner) {
  clearInterval(timer);
  alert(`🎉 Player ${winner} wins!`);
  location.reload();
}

function updateHealthBar(id, hp) {
  document.getElementById(id).style.width = hp + "%";
}

function resetHealthBars() {
  updateHealthBar("player1-health", 100);
  updateHealthBar("player2-health", 100);
}