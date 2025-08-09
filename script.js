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
    size: randomRange(5, 10),
    color: `hsl(${randomRange(180, 240)}, 70%, 60%)`,
    speed: randomRange(2, 5),
    drift: randomRange(-1, 1),
    rotation: randomRange(0, 360),
    rotationSpeed: randomRange(-5, 5)
  };
}

function drawConfettiPiece(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  ctx.restore();
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p, i) => {
    p.y += p.speed;
    p.x += p.drift;
    p.rotation += p.rotationSpeed;

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

function burstConfetti(count = 100) {
  for (let i = 0; i < count; i++) {
    confetti.push(createConfettiPiece());
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  burstConfetti(150);
  setInterval(() => {
    if (running) burstConfetti(10);
  }, 200);
});

// Первоначальный залп при заходе
burstConfetti(80);
updateConfetti();
