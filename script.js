// script.js — улучшённый интерактив для поздравления
(() => {
  // Elements
  const celebrateBtn = document.getElementById('celebrateBtn');
  const littleBtn = document.getElementById('littleBtn');
  const saveBtn = document.getElementById('saveBtn');
  const shareBtn = document.getElementById('shareBtn');
  const nameInput = document.getElementById('nameInput');
  const recipientSpan = document.getElementById('recipient');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');

  // Visuals
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const balloonsBox = document.getElementById('balloons');
  const card = document.getElementById('card');

  // Resize canvas to visuals area
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Respect user motion preferences
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- confetti system ---------------- */
  const confettiParticles = [];
  let confettiAnim = null;

  function rand(min, max){ return Math.random() * (max - min) + min; }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  const shapes = ['rect','circle','emoji'];
  const emojiList = ['🎉','🎈','✨','🍰','🥳','🎁'];

  class Particle {
    constructor(x, y, vx, vy, size, color, shape, life){
      this.x = x; this.y = y; this.vx = vx; this.vy = vy;
      this.size = size; this.color = color; this.shape = shape;
      this.life = life; this.ttl = life;
      this.spin = rand(-0.12, 0.12);
      this.angle = rand(0, Math.PI*2);
    }
    update(dt){
      this.x += this.vx*dt;
      this.y += this.vy*dt;
      this.vy += 30*dt; // gravity
      this.angle += this.spin;
      this.ttl -= dt;
    }
    draw(ctx){
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      if(this.shape === 'rect'){
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*0.6);
      } else if(this.shape === 'circle'){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(0,0,this.size/2,0,Math.PI*2);
        ctx.fill();
      } else {
        // emoji
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pick(emojiList), 0, 0);
      }
      ctx.restore();
    }
  }

  function emitBurst(x, y, count = 60){
    for(let i=0;i<count;i++){
      const angle = rand(0, Math.PI*2);
      const speed = rand(40,300);
      const vx = Math.cos(angle)*speed;
      const vy = Math.sin(angle)*speed * 0.7 - rand(10,120);
      const size = rand(8,26);
      const shape = pick(shapes);
      const hue = Math.floor(rand(10,360));
      const color = `hsl(${hue} 80% 60%)`;
      confettiParticles.push(new Particle(x, y, vx, vy, size, color, shape, rand(1.2, 3)));
    }
  }

  let lastTime = performance.now();
  function render(now){
    const dt = Math.min(0.04, (now - lastTime)/1000);
    lastTime = now;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0,0,rect.width, rect.height);

    // update and draw
    for(let i = confettiParticles.length - 1; i >= 0; i--){
      const p = confettiParticles[i];
      p.update(dt);
      p.draw(ctx);
      if(p.ttl <= 0 || p.y > rect.height + 50) confettiParticles.splice(i,1);
    }

    confettiAnim = requestAnimationFrame(render);
  }

  /* -------------- balloons system (DOM) -------------- */
  function spawnBalloons(n = 6){
    // clear existing
    balloonsBox.innerHTML = '';
    for(let i=0;i<n;i++){
      const b = document.createElement('div');
      b.className = 'balloon';
      const size = rand(36,84);
      const left = rand(4,92);
      b.style.position = 'absolute';
      b.style.left = left + '%';
      b.style.bottom = (-rand(10,80)) + 'px';
      b.style.width = size + 'px';
      b.style.height = size*1.2 + 'px';
      b.style.borderRadius = '48%';
      b.style.background = `linear-gradient(180deg, hsla(${rand(0,360)} 90% 65% / .95), hsla(${rand(0,360)} 80% 55% / .9))`;
      b.style.boxShadow = '0 8px 22px rgba(2,6,23,0.55)';
      b.style.transform = `translateY(${rand(0, -400)}px) rotate(${rand(-8,8)}deg)`;
      b.style.opacity = 0;
      b.style.pointerEvents = 'none';
      b.style.zIndex = 4;
      // string
      const stringEl = document.createElement('div');
      stringEl.style.width = '2px';
      stringEl.style.height = '80px';
      stringEl.style.background = 'rgba(255,255,255,0.06)';
      stringEl.style.position = 'absolute';
      stringEl.style.left = '50%';
      stringEl.style.top = (size*1.2 - 6) + 'px';
      stringEl.style.transform = 'translateX(-50%)';
      b.appendChild(stringEl);
      balloonsBox.appendChild(b);

      // animate with JS (simple)
      setTimeout(() => {
        b.style.transition = `transform ${rand(6,12)}s cubic-bezier(.2,.9,.2,1), opacity 800ms`;
        b.style.opacity = 1;
        b.style.transform = `translateY(${-rectHeight()}px) rotate(${rand(-20,20)}deg)`;
      }, rand(120, 900));
    }
  }
  function rectHeight(){ return document.querySelector('.stage-visuals').getBoundingClientRect().height + 150; }

  /* -------------- sound (WebAudio) -------------- */
  let audioCtx = null;
  function playMelody(){
    if(reduceMotion) return;
    try {
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = [440, 660, 880, 660, 523.25, 659.25]; // A4, E5... simple
      const master = audioCtx.createGain();
      master.connect(audioCtx.destination);
      master.gain.value = 0.06;
      notes.forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        o.type = i % 2 === 0 ? 'sine' : 'triangle';
        o.frequency.value = freq;
        const g = audioCtx.createGain();
        g.gain.value = 0;
        o.connect(g); g.connect(master);
        o.start(now + i*0.12);
        g.gain.setValueAtTime(0, now + i*0.12);
        g.gain.linearRampToValueAtTime(1, now + i*0.12 + 0.02);
        g.gain.linearRampToValueAtTime(0, now + i*0.12 + 0.22);
        o.stop(now + i*0.12 + 0.26);
      });
    } catch(e){ console.warn('Audio not available', e) }
  }

  /* -------------- modal & UX -------------- */
  function showModal(name){
    document.getElementById('modalText').textContent = `Дорогой ${name}! Желаю радости, здоровья и отличного настроения!`;
    modal.classList.remove('hidden');
    modal.querySelector('.modal-card').animate([{ transform: 'translateY(18px) scale(.98)', opacity:0 }, { transform:'translateY(0) scale(1)', opacity:1 }], { duration:380, easing:'cubic-bezier(.2,.9,.2,1)' });
  }
  function hideModal(){
    modal.classList.add('hidden');
  }
  closeModal.addEventListener('click', hideModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) hideModal(); });

  /* -------------- celebration sequence -------------- */
  function celebrate(type = 'full'){
    // name handling
    const name = (nameInput.value || recipientSpan.textContent || 'друг').trim();
    recipientSpan.textContent = name;
    // disable
    celebrateBtn.disabled = true;
    littleBtn.disabled = true;
    celebrateBtn.textContent = 'В пути...';

    // small pre-burst
    emitBurst(200, 80, 24);
    spawnBalloons(6);

    // start render loop
    cancelAnimationFrame(confettiAnim);
    lastTime = performance.now();
    confettiAnim = requestAnimationFrame(render);

    // main melody and main burst
    setTimeout(()=>emitMain(name, type), 600);
  }

  function emitMain(name, type){
    // position: center of visuals area relative to canvas
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width/2;
    const cy = rect.height/2 - 20;
    // big confetti bursts
    emitBurst(cx, cy, type === 'full' ? 120 : 60);
    emitBurst(cx - 120, cy - 20, 50);
    emitBurst(cx + 120, cy + 20, 50);
    // repeated gentle rain
    const rainInterval = setInterval(()=> emitBurst(rand(20,rect.width-20), -10, 18), 350);
    // play melody
    playMelody();
    // show modal after a bit
    setTimeout(()=> showModal(name), 900);
    // stop after 6s
    setTimeout(()=>{
      clearInterval(rainInterval);
      // gracefully stop animation when no particles
      setTimeout(()=> {
        if(confettiParticles.length === 0){
          cancelAnimationFrame(confettiAnim);
          confettiAnim = null;
        }
      }, 1400);
      celebrateBtn.disabled = false;
      celebrateBtn.textContent = 'Праздник!';
    }, 6000);
  }

  // Little button — небольшой сюрприз: эмоджи + короткий всплеск
  littleBtn.addEventListener('click', () => {
    celebrate('mini');
  });

  celebrateBtn.addEventListener('click', () => {
    celebrate('full');
  });

  // name input update
  nameInput.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    recipientSpan.textContent = v || 'Станислав';
  });

  /* -------------- save as PNG (рисуем упрощённую открытку в canvas) -------------- */
  saveBtn.addEventListener('click', async () => {
    const w = 1200, h = 675;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const g = out.getContext('2d');

    // background gradient
    const grad = g.createLinearGradient(0,0,w,h);
    grad.addColorStop(0, '#11233a');
    grad.addColorStop(1, '#0f1724');
    g.fillStyle = grad;
    g.fillRect(0,0,w,h);

    // title
    g.fillStyle = '#fff';
    g.font = 'bold 64px "Playfair Display", serif';
    g.textAlign = 'center';
    g.fillText(`С Днём Рождения, ${recipientSpan.textContent}!`, w/2, 180);

    // small cake
    g.fillStyle = '#ffd1b6';
    g.fillRect(w/2 - 120, 260, 240, 120);
    g.fillStyle = '#fff7f0';
    g.fillRect(w/2 - 100, 220, 200, 60);

    // footer text
    g.font = '24px Montserrat, sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.fillText('Открытка создана специально для тебя 🎉', w/2, 520);

    // convert and download
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `otkrytka-${recipientSpan.textContent || 'friend'}.png`;
    a.click();
  });

  // share via Web Share API if available
  shareBtn.addEventListener('click', async () => {
    const name = recipientSpan.textContent || 'друг';
    if(navigator.share){
      try{
        await navigator.share({
          title: `Поздравление для ${name}`,
          text: `С Днём Рождения, ${name}! Открой эту открытку 🎉`,
          // url: location.href // optional if hosted
        });
      }catch(e){ console.warn('share cancelled', e) }
    } else {
      // fallback: copy to clipboard a short message
      try{
        await navigator.clipboard.writeText(`С Днём Рождения, ${name}! Открой открытку — ${location.href}`);
        shareBtn.textContent = 'Скопировано!';
        setTimeout(()=> shareBtn.textContent = 'Поделиться', 1400);
      }catch(e){
        alert('Поделиться не доступно в этом браузере. Попробуй скопировать ссылку вручную.');
      }
    }
  });

  // init: set default recipient from current DOM or input
  (function init(){
    const defaultName = recipientSpan.textContent || 'Станислав';
    nameInput.value = defaultName;
    // initial visual sizing
    resizeCanvas();
  })();

  // graceful stop on unload
  window.addEventListener('unload', ()=> {
    cancelAnimationFrame(confettiAnim);
    if(audioCtx && audioCtx.state !== 'closed') audioCtx.close();
  });

})();
