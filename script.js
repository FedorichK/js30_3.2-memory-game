const memCards = document.querySelectorAll('.card');

function invertCard() {
    this.classList.toggle('invert')
}

memCards.forEach(memCard => memCard.addEventListener('click', invertCard));