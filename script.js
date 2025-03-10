// Получение элементов
const flowerButton = document.getElementById('flowerButton');
const roseCountSpan = document.getElementById('roseCount');
const openSkillTreeButton = document.getElementById('openSkillTree');
const skillTreeModal = document.getElementById('skillTreeModal');
const closeSkillTreeButton = document.getElementById('closeSkillTree');
const skillTreeGrid = document.getElementById('skillTreeGrid');

// Начальные значения
let roseCount = 0;
let clickValue = 1;

// Функция для загрузки данных из localStorage
function loadGame() {
    const savedRoseCount = localStorage.getItem('roseCount');
    const savedSkills = localStorage.getItem('skills');

    if (savedRoseCount) {
        roseCount = parseInt(savedRoseCount);
    }
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    }

    updateUI();
}

// Функция для сохранения данных в localStorage
function saveGame() {
    localStorage.setItem('roseCount', roseCount);
    localStorage.setItem('skills', JSON.stringify(skills));
}

// Функция для обновления интерфейса
function updateUI() {
    roseCountSpan.textContent = roseCount;
    skills.forEach(skill => {
        const skillElement = document.getElementById(skill.id);
        if (skillElement && skill.isUnlocked) {
            skillElement.classList.add('unlocked');
        }
    });
}

// Массив навыков
let skills = [
    { id: 'autoClick', name: 'Авто-клик', cost: 100, description: 'Автоматически собирает розы раз в секунду.', isUnlocked: false, effect: () => { autoClick(); } },
    { id: 'doubleClick', name: 'Двойной клик', cost: 200, description: 'Удваивает количество роз за клик.', isUnlocked: false, effect: () => { clickValue *= 2; } },
    { id: 'roseBoost', name: 'Ускоритель роз', cost: 500, description: 'Увеличивает количество роз за клик на 5.', isUnlocked: false, effect: () => { clickValue += 5; } },
    { id: 'universeExpansion', name: 'Расширение Вселенной', cost: 1000, description: 'Улучшает визуальные эффекты Вселенной Роз.', isUnlocked: false, effect: () => { upgradeUniverse(); } },
    { id: 'rareRose', name: 'Редкая роза', cost: 2000, description: 'Увеличивает шанс выпадения редких роз в 10 раз.', isUnlocked: false, effect: () => { increaseRareRoseChance(); } },
    // Добавь другие навыки
];

// Функция для создания элемента навыка
function createSkillElement(skill) {
    const skillElement = document.createElement('div');
    skillElement.classList.add('skill-tree-item');
    skillElement.id = skill.id;
    skillElement.innerHTML = `
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <p>Стоимость: ${skill.cost} роз</p>
    `;

    skillElement.addEventListener('click', () => {
        if (roseCount >= skill.cost && !skill.isUnlocked) {
            roseCount -= skill.cost;
            skill.isUnlocked = true;
            skill.effect();
            updateUI();
            saveGame();
        } else if (skill.isUnlocked) {
            alert('Этот навык уже изучен!');
        } else {
            alert('Недостаточно роз!');
        }
    });

    return skillElement;
}

// Функция для заполнения древа навыков
function populateSkillTree() {
    skills.forEach(skill => {
        const skillElement = createSkillElement(skill);
        skillTreeGrid.appendChild(skillElement);
    });
}

// Авто-клик
function autoClick() {
    setInterval(() => {
        roseCount += clickValue;
        updateUI();
        saveGame();
    }, 1000);
}

// Улучшение Вселенной Роз
function upgradeUniverse() {
    // Добавь визуальные эффекты для вселенной роз
}

// Увеличение шанса выпадения редких роз
function increaseRareRoseChance() {
    // Добавь логику для увеличения шанса выпадения редких роз
}

// Сбор роз
flowerButton.addEventListener('click', () => {
    roseCount += clickValue;
    updateUI();
    saveGame();
});

// Открытие и закрытие древа навыков
openSkillTreeButton.addEventListener('click', () => {
    skillTreeModal.style.display = 'flex';
});

closeSkillTreeButton.addEventListener('click', () => {
    skillTreeModal.style.display = 'none';
});

// Загрузка данных и заполнение древа навыков при загрузке страницы
loadGame();
populateSkillTree();

const flowerButton = document.getElementById('flowerButton');

// Добавление класса для анимации пульсации
flowerButton.classList.add('pulse');

// Добавление класса для анимации изменения цвета (по желанию)
// flowerButton.classList.add('color-change');

const roseRainContainer = document.querySelector('.rose-rain');

function createRose() {
    const rose = document.createElement('div');
    rose.classList.add('rose');
    roseRainContainer.appendChild(rose);

    // Случайные значения
    const randomX = Math.random() * 100; // Позиция по горизонтали
    const randomDelay = Math.random() * 5; // Задержка перед началом падения
    const randomDuration = Math.random() * 10 + 5; // Длительность падения
    const randomSize = Math.random() * 20 + 20; // Размер розы

    rose.style.left = `${randomX}%`;
    rose.style.animationDelay = `${randomDelay}s`;
    rose.style.animationDuration = `${randomDuration}s`;
    rose.style.width = `${randomSize}px`;
    rose.style.height = `${randomSize}px`;

    // Удаление розы после завершения анимации
    rose.addEventListener('animationend', () => {
        rose.remove();
    });
}

// Создание роз с определенной частотой
setInterval(() => {
    createRose();
}, 200); // Создание розы каждые 200 миллисекунд

const flashElement = document.querySelector('.flash');

flowerButton.addEventListener('click', () => {
    // Показ вспышки
    flashElement.style.display = 'block';
    flashElement.classList.add('flash');

    // Скрытие вспышки после завершения анимации
    flashElement.addEventListener('animationend', () => {
        flashElement.classList.remove('flash');
        flashElement.style.display = 'none';
    });
});

import { CountUp } from 'countup.js'; // Убедись, что CountUp.js подключена

const roseCountSpan = document.getElementById('roseCount');
let roseCount = 0;
let countUp = new CountUp(roseCountSpan, roseCount, { duration: 1 }); // Создание экземпляра CountUp

flowerButton.addEventListener('click', () => {
    roseCount += clickValue;

    // Обновление счетчика с анимацией
    countUp.update(roseCount);

    // ... остальной код ...
});

function createSkillElement(skill) {
    const skillElement = document.createElement('div');
    skillElement.classList.add('skill-tree-item');
    skillElement.id = skill.id;
    skillElement.innerHTML = `
        <h3>${skill.name}</h3>
        <p>${skill.description}</p>
        <p>Стоимость: ${skill.cost} роз</p>
    `;

    skillElement.addEventListener('click', () => {
        if (roseCount >= skill.cost && !skill.isUnlocked) {
            roseCount -= skill.cost;
            skill.isUnlocked = true;

            // Добавление анимации при изучении навыка
            skillElement.classList.add('unlock-animation');
            skillElement.addEventListener('animationend', () => {
                skillElement.classList.remove('unlock-animation');
            });

            skill.effect();
            updateUI();
            saveGame();
        } else if (skill.isUnlocked) {
            alert('Этот навык уже изучен!');
        } else {
            alert('Недостаточно роз!');
        }
    });

    return skillElement;
}
