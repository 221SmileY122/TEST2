// Получение элементов
const flowerButton = document.getElementById('getRose');
const roseCountSpan = document.getElementById('roseCount');
const openSkillTreeButton = document.getElementById('openSkillTree');
const skillTreeModal = document.getElementById('skillTreeModal');
const closeSkillTreeButton = document.getElementById('closeSkillTree');
const skillTreeGrid = document.getElementById('skillTreeGrid');
const flashElement = document.querySelector('.flash');

// Начальные значения
let roseCount = 0;

// Массив навыков
let skills = [
    { id: 'autoClick', name: 'Авто-клик', cost: 100, description: 'Автоматически собирает розы раз в секунду.', isUnlocked: false, effect: () => { autoClick(); } },
    { id: 'doubleClick', name: 'Двойной клик', cost: 200, description: 'Удваивает количество роз за клик.', isUnlocked: false, effect: () => { clickValue *= 2; } },
    { id: 'roseBoost', name: 'Ускоритель роз', cost: 500, description: 'Увеличивает количество роз за клик на 5.', isUnlocked: false, effect: () => { clickValue += 5; } },
    { id: 'reincarnation', name: 'Реинкарнация', cost: 10000, description: 'Полностью меняет интерфейс сайта.', isUnlocked: false, effect: () => { reincarnation(); } },
    // Добавь другие навыки
];

let clickValue = 1;

// Функция для добавления роз
function addRoses() {
    roseCount += clickValue;
    roseCountSpan.textContent = roseCount;

    // Показ вспышки
    flashElement.style.display = 'block';
    flashElement.classList.add('flash');

    // Скрытие вспышки после завершения анимации
    flashElement.addEventListener('animationend', () => {
        flashElement.classList.remove('flash');
        flashElement.style.display = 'none';
    });
}

// Функция для авто-клика
function autoClick() {
    setInterval(() => {
        roseCount += clickValue;
        roseCountSpan.textContent = roseCount;
    }, 1000);
}

// Функция для реинкарнации
function reincarnation() {
    // Полностью меняет интерфейс сайта
    document.body.style.background = 'linear-gradient(135deg, #ff69b4 0%, #ffd7d7 100%)';
    document.querySelector('.title').style.color = '#d6336c';
}

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
            roseCountSpan.textContent = roseCount;
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

// Открытие и закрытие древа навыков
openSkillTreeButton.addEventListener('click', () => {
    skillTreeModal.style.display = 'flex';
});

closeSkillTreeButton.addEventListener('click', () => {
    skillTreeModal.style.display = 'none';
});

// Сбор роз
flowerButton.addEventListener('click', addRoses);

// Заполнение древа навыков
populateSkillTree();
