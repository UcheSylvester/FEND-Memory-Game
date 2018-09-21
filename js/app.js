/*
 * Create a list that holds all of your cards
 */

const deck = document.querySelector('.deck');
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Function that shuffles the card on the deck using the shuffle function provided above:
function toShuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for(let i = 0; i < shuffledCards.length; i++) {
		deck.appendChild(shuffledCards[i]);
	}
}
toShuffleDeck();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in andother function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// SETTING THE EVENT LISTENER FOR CLICK ON THE CARDS
deck.addEventListener('click', function(evt) {
	const clickTarget = evt.target;
	if(clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget)) {
		if(clockOff) {
			startClock();
			clockOff = false;
		}
		toggleCard(clickTarget);
		addToToggledCards(clickTarget);
		if(toggledCards.length === 2) {
			checkForMatch(clickTarget);
			increaseMove();
			checkScore();
		}
	}
})

// Function that toggles cards
function toggleCard(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
};


// Function that adds the toggled cards to toggledCards array
function addToToggledCards(clickTarget) {
	toggledCards.push(clickTarget);
};

// Function that checks for match and sets timeout for unmatched cards
function checkForMatch() {
	if(toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className) {
		console.log('Matched!');
		toggledCards[0].classList.toggle('bounce');
		toggledCards[1].classList.toggle('bounce');

		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
		matched++;
		setTimeout(function() {
			win();
		}, 700)
	} else {
		setTimeout(function() {
			console.log('Not a match!');

			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			toggledCards = [];
		}, 500);
	}
}

// Function to increase moves for each turns of click
function increaseMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

// Function that computes the score and ratings using the moves
function checkScore() {
	if(moves === 16 || moves === 24) {
		hideStar();
	}
}

// Function that hides star
function hideStar() {
	const starList = document.querySelectorAll('.stars li');
	for(let i = 0; i < starList.length; i++) {
		if (starList[i].style.display !== 'none') {
			starList[i].style.display = 'none';
			break;
		}
	}
}

// Function that starts the clock timer
function startClock() {
	clockId = setInterval(function() {
		time++;
		displayTime();
	}, 1000);
}

// Function that displays the clock
function displayTime() {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	const clock = document.querySelector('.clock');
	clock.innerHTML = 'TIME: ' + time;
	if(seconds < 10) {
		clock.innerHTML = `TIME: ${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `TIME: ${minutes}:${seconds}`;
	}
}

// Function that stops or pauses clock
function stopClock() {
	clearInterval(clockId);
}

// function to toggle the start modal
function toggleStartModal() {
	const modal = document.querySelector('.intro-modal');
	modal.classList.toggle('hide');
}
toggleStartModal();

// Function to show or hide the game over Modal
function toggleModal() {
	const modal = document.querySelector('.modal-background');
	if(modal.classList.contains('hide')) {
		modal.classList.remove('hide');
	} else {
		modal.classList.add('hide');
	}
}

// Function that displays the modal stats
function writeModalStats() {
	const timeStat = document.querySelector('.modal-time');
	const clockTime = document.querySelector('.clock').textContent;
	const movesStat = document.querySelector('.modal-moves');
	const starsStat = document.querySelector('.modal-stars');
	const stars = getStars();

	timeStat.innerHTML = `${clockTime}`;
	movesStat.innerHTML = `MOVES : ${moves}`;
	starsStat.innerHTML = `STARS : ${stars}`;
}

// Function that gets the stars to be displayed on the modal
function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for(star of stars) {
		if(star.style.display !== 'none') {
			starCount++;
		}
	}
	return starCount;
}

// Making the restart icon reset the game on click
document.querySelector('.restart').addEventListener('click', resetGame);

// Making the cancel button on the modal close modal on click
document.querySelector('.modal-cancel', '.modal-close').addEventListener('click', toggleModal);

// Making the replay button on the modal reset the game on click
document.querySelector('.modal-replay').addEventListener('click', replayGame);

document.querySelector('.intro-modal-btn').addEventListener('click', toggleStartModal);

// Function that resets the game
function resetGame() {
	matched = 0;
	resetClock();
	resetMoves();
	resetStars();
	toShuffleDeck();
	resetCards();
}

// Function that resets clock and time
function resetClock() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

// To reset moves
function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

// Function that resets stars
function resetStars() {
	stars = 0;
	const starList = document.querySelectorAll('.stars li');
	for(star of starList) {
		star.style.display = 'inline';
	}
}

// Checking for win condition
function win() {
	if(matched === TOTAL_PAIRS) {
		gameOver();
	}
}

// function that ends game
function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
	resetCards();
}

// Function to replay game
function replayGame() {
	resetGame();
	toggleModal();
	resetCards();
}

// Function that resets the cards
function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}
}
