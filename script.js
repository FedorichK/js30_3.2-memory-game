const cards = document.querySelectorAll('.card');

let hasCardInverted = false;
let boardLocked = false;
let cardOne, cardTwo;

let clickSound = new Audio("./sounds/click.mp3");
let successSound = new Audio('./sounds/succes.mp3');
let errorSound = new Audio('./sounds/error.mp3');
let newGameSound = new Audio('./sounds/new.mp3');

let moveCount = 0;
let totalPairs = 6;

let results = JSON.parse(localStorage.getItem('results')) || [];

document.getElementById('newGameButton').addEventListener('click', function() {
    newGameSound.play();
    setTimeout(function(){ location.reload(); }, 1500);
});

function handleCardClick() {
    if (boardLocked) return;
    if (this === cardOne) return;

    clickSound.play();

    this.classList.add('invert');

    if (!hasCardInverted) {
        hasCardInverted = true;
        cardOne = this;
        moveCount++;
        return;
    }

    cardTwo = this;
    moveCount++;

    verifyMatch();
}

function verifyMatch() {
    let isMatch = cardOne.dataset.framework === cardTwo.dataset.framework;

    isMatch ? successSound.play() : errorSound.play();

    isMatch ? disableCards() : unInvertCards();
}

function disableCards() {
    cardOne.removeEventListener('click', handleCardClick);
    cardTwo.removeEventListener('click', handleCardClick);

    totalPairs--;

    if (totalPairs === 0) {
        setTimeout(function() {
            document.querySelector('.memory__cards').style.display = 'none';

            let endGameMessage = document.getElementById('endGameMessage');
            endGameMessage.textContent = 'Your count is ' + moveCount + ' moves';
            endGameMessage.style.display = 'block';

            // Сохраняем результат текущей игры
            results.push(moveCount);

            // Если в массиве больше 10 результатов, удаляем самый старый
            if (results.length > 10) {
                results.shift();
            }

            // Сохраняем массив результатов в Local Storage
            localStorage.setItem('results', JSON.stringify(results));

            // Отображаем таблицу рекордов
            displayResults();
        }, 500);
    }

    resetGameBoard();
}

function displayResults() {
    let resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = '<tr><th>Game</th><th>Moves</th></tr>';

    for (let i = 0; i < results.length; i++) {
        let row = document.createElement('tr');
        row.innerHTML = '<td>' + (i + 1) + '</td><td>' + results[i] + '</td>';
        resultsTable.appendChild(row);
    }

    resultsTable.style.display = 'block';
}



function unInvertCards() {
    boardLocked = true;

    setTimeout(() => {
        cardOne.classList.remove('invert');
        cardTwo.classList.remove('invert');

        resetGameBoard();
    }, 1500);
}


function resetGameBoard() {
    [hasCardInverted, boardLocked] = [false, false];
    [cardOne, cardTwo] = [null, null];
}

(function randomizeCards() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', handleCardClick));
