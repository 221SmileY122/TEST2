function explodeRoses() {
    const rosesContainer = document.getElementById('roses');
    rosesContainer.innerHTML = ''; // Очистка предыдущих розочек
    for (let i = 0; i < 10; i++) {
        const rose = document.createElement('div');
        rose.className = 'rose';
        const angle = (i / 10) * 360;
        const distance = 100;
        rose.style.transform = `rotate(${angle}deg) translate(${distance}px) rotate(-${angle}deg)`;
        rosesContainer.appendChild(rose);
    }
}
