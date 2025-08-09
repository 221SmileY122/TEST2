function burstConfettiExplosion(count = 100) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < count; i++) {
    const angle = randomRange(0, 2 * Math.PI);
    const distance = randomRange(0, 30); // стартовая "глубина" взрыва
    const speed = randomRange(4, 8);     // исходная скорость взрыва

    confetti.push({
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      size: randomRange(4, 9),
      color: `hsl(${randomRange(190, 230)}, 80%, 70%)`,
      speedY: Math.sin(angle) * speed,
      speedX: Math.cos(angle) * speed,
      drift: randomRange(-0.5, 0.5), // лёгкая неустойчивость по горизонтали
      decay: randomRange(0.96, 0.985) // плавное замедление
    });
  }
}

// Подправь updateConfetti — обработай разлёт взрыва:
function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((p, i) => {
    // Если это взрывная частица
    if ('speedX' in p && 'speedY' in p && 'decay' in p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedX *= p.decay;
      p.speedY *= p.decay;
    } else {
      // Обычные: просто падают
      p.y += p.speed;
      p.x += p.drift;
    }

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

// Теперь на нажатие кнопки запусти эффект взрыва:
document.getElementById("startBtn").addEventListener("click", () => {
  running = true;
  burstConfettiExplosion(120); // взрыв
  setInterval(() => {
    if (running) burstConfetti(5); // обычные падающие добавляются
  }, 180);
});

// Первоначальный залп можно оставить как есть или уменьшить:
burstConfetti(40);
updateConfetti();
