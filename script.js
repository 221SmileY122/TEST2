const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let confetti = [];
let running = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createConfettiPiece() {
  return {
    x: randomRange(0, canvas.width),
    y: randomRange(-canvas.height, 0),
    size: randomRange(4, 8),
    color: `hsl(${randomRange(190, 230)}, 80%, 70%)`,
    speed: randomRange(1, 3),
    drift: randomRange(-0.5, 0.5)
  };
}

function drawConfettiPiece(p) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p, i) => {
    p.y += p.speed;
    p.x += p.drift;

    if (p.y > canvas.height) {
      if (running) {
        confetti[i] = createConfettiPiece();
        confetti[i].y = -10;
      } else {
        confetti.splice(i, 1);
      }
    }
    drawConfettiPiece(p);
  });

  requestAnimationFrame(updateConfetti);
}

function burstConfetti(count = 80) {
  for (let i = 0; i < count; i++) {
    confetti.push(createConfettiPiece());
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  burstConfetti(120);
  setInterval(() => {
    if (running) burstConfetti(5);
  }, 150);
});

// Первоначальный залп при загрузке
burstConfetti(50);
updateConfetti();
