const btn = document.getElementById('celebrateBtn');
const message = document.getElementById('message');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

let confettiElements = [];
const confettiCount = 150;
let animationFrame;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

class Confetti {
  constructor() {
    this.x = randomRange(0, window.innerWidth);
    this.y = randomRange(-20, window.innerHeight);
    this.size = randomRange(7, 12);
    this.speed = randomRange(2, 5);
    this.angle = randomRange(0, 2 * Math.PI);
    this.spin = randomRange(0.1, 0.3);
    this.color = `hsl(${Math.floor(randomRange(0, 360))}, 70%, 60%)`;
    this.tilt = randomRange(-10, 10);
    this.tiltSpeed = randomRange(0.05, 0.12);
  }

  update() {
    this.y += this.speed;
    this.angle += this.spin;
    this.tilt += this.tiltSpeed;
    if (this.y > window.innerHeight) {
      this.y = -10;
      this.x = randomRange(0, window.innerWidth);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.lineWidth = this.size / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.tilt + Math.cos(this.angle) * this.size / 2, this.y + Math.sin(this.angle) * this.size / 2);
    ctx.lineTo(this.x + this.tilt, this.y + this.size / 2);
    ctx.stroke();
  }
}

function initConfetti() {
  confettiElements = [];
  for (let i = 0; i < confettiCount; i++) {
    confettiElements.push(new Confetti());
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiElements.forEach(c => {
    c.update();
    c.draw();
  });
  animationFrame = requestAnimationFrame(renderConfetti);
}

btn.addEventListener('click', () => {
  btn.disabled = true;
  btn.style.cursor = 'default';
  btn.style.opacity = '0.6';

  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('show'), 20);

  initConfetti();
  resizeCanvas();
  renderConfetti();

  // Остановим конфетти через 6 секунд и уберем кнопку
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    btn.style.display = 'none';
  }, 6000);
});

window.addEventListener('resize', () => {
  resizeCanvas();
});
