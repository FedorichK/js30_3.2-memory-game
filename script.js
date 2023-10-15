const cards = document.querySelectorAll('.card');

let hasCardInverted = false;
let boardLocked = false;
let cardOne, cardTwo;

let clickSound = new Audio("./sounds/click.mp3");
let successSound = new Audio('./sounds/succes.mp3');
let errorSound = new Audio('./sounds/error.mp3');
let newGameSound = new Audio('./sounds/new.mp3');

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
        return;
    }

    cardTwo = this;

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

    resetGameBoard();
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
