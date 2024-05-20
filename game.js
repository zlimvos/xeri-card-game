document.getElementById('startGame').addEventListener('click', startGame);

let handP1 = [];
let handP2 = [];
let deckP1 = [];
let deckP2 = [];
let deckMid = [];
let TopCard = [];
let xeriP1 = [];
let xeriP2 = [];
let currentPlayer = 'Player 1';
let deck = [];
let lastPlayerToPickUp = null;
let xeriCountP1 = 0;
let xeriCountP2 = 0;

function startGame() {
    initializeGame();
    firstDeal();
    updateGameBoard();
    enableCardClicks();
    clearMessages(); // Clear messages when starting a new game
    addMessage("Game started", 'green');
    console.log("Game started");
}

function initializeGame() {
    deck = createDeck();
    shuffleDeck(deck);
    handP1 = [];
    handP2 = [];
    deckP1 = [];
    deckP2 = [];
    deckMid = [];
    TopCard = [];
    xeriP1 = [];
    xeriP2 = [];
    xeriCountP1 = 0;
    xeriCountP2 = 0;
    currentPlayer = 'Player 1';
    lastPlayerToPickUp = null;
    console.log("Game initialized");
    console.log(deck);
}

function enableCardClicks() {
    const handP1Element = document.getElementById('handP1');
    const handP2Element = document.getElementById('handP2');
    if (currentPlayer === 'Player 1') {
        handP1Element.classList.add('active');
        handP2Element.classList.remove('active');
    } else {
        handP1Element.classList.remove('active');
        handP2Element.classList.add('active');
    }
}

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: value, suit: suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function firstDeal() {
    for (let i = 0; i < 6; i++) {
        handP1.push(deck.pop());
        handP2.push(deck.pop());
    }
    for (let i = 0; i < 4; i++) {
        deckMid.push(deck.pop());
    }
    if (deckMid.length > 0) {
        TopCard.push(deckMid[deckMid.length - 1]);
    }
    console.log("First deal done");
    console.log("Player 1 hand:", handP1);
    console.log("Player 2 hand:", handP2);
    console.log("Table:", deckMid);
}

function newDeal() {
    if (deck.length > 0) {
        for (let i = 0; i < 6; i++) {
            if (deck.length > 0) handP1.push(deck.pop());
            if (deck.length > 0) handP2.push(deck.pop());
        }
    }
}

function updateGameBoard() {
    // Update Player 1's hand
    const handP1Element = document.getElementById('handP1');
    handP1Element.innerHTML = '';
    handP1.forEach((card, idx) => {
        const cardElement = document.createElement('div');
        cardElement.innerText = `${card.value} ${card.suit}`;
        cardElement.addEventListener('click', () => playCard('Player 1', idx, handP1, deckP1, xeriP1, card));
        handP1Element.appendChild(cardElement);
    });

    // Update Player 2's hand
    const handP2Element = document.getElementById('handP2');
    handP2Element.innerHTML = '';
    handP2.forEach((card, idx) => {
        const cardElement = document.createElement('div');
        cardElement.innerText = `${card.value} ${card.suit}`;
        cardElement.addEventListener('click', () => playCard('Player 2', idx, handP2, deckP2, xeriP2, card));
        handP2Element.appendChild(cardElement);
    });

    // Update the mid deck
    const deckMidElement = document.getElementById('deckMid');
    deckMidElement.innerHTML = '';
    deckMid.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.innerText = `${card.value} ${card.suit}`;
        deckMidElement.appendChild(cardElement);
    });

    // Update the top card
    const topCardElement = document.getElementById('topCard');
    topCardElement.innerHTML = TopCard.length > 0 ? `${TopCard[0].value} ${TopCard[0].suit}` : '';

    // Update deck counts
    updateDeckCounts();

    console.log("Game board updated");
}

function updateDeckCounts() {
    // Update Player 1's deck count and Xeri count
    const deckP1Element = document.getElementById('deckP1');
    deckP1Element.innerHTML = `Deck: ${deckP1.length} cards<br>Ξερή: ${xeriCountP1}`;

    // Update Player 2's deck count and Xeri count
    const deckP2Element = document.getElementById('deckP2');
    deckP2Element.innerHTML = `Deck: ${deckP2.length} cards<br>Ξερή: ${xeriCountP2}`;
}

function playCard(player, idx, hand, deckPlayer, xeri, chosen_card) {
    if (deckMid.length === 1 && TopCard.length > 0 && (chosen_card.value === TopCard[0].value)) {
        addMessage(`${player} made a Ξερή with ${chosen_card.value} ${chosen_card.suit}`, player === 'Player 1' ? 'red' : 'blue');
        xeri.push(chosen_card);
        deckPlayer.push(...deckMid, chosen_card);
        deckMid = [];
        TopCard = [];
        lastPlayerToPickUp = player;
        if (player === 'Player 1') {
            xeriCountP1++;
        } else {
            xeriCountP2++;
        }
    } else if (TopCard.length > 0 && (chosen_card.value === 'J' || chosen_card.value === TopCard[0].value)) {
        deckPlayer.push(...deckMid, chosen_card);
        deckMid = [];
        TopCard = [];
        setTimeout(() => {
            addMessage(`${player} collects all cards from the table with ${chosen_card.value} ${chosen_card.suit}!`, player === 'Player 1' ? 'red' : 'blue');
        }, 100);
        lastPlayerToPickUp = player;
    } else {
        deckMid.push(chosen_card);
        TopCard[0] = deckMid[deckMid.length - 1];
    }

    hand.splice(idx, 1);

    updateGameBoard();
    switchPlayer();

    if (handP1.length === 0 && handP2.length === 0) {
        newDeal();
        if (handP1.length === 0 && handP2.length === 0) {
            endofgame();
        } else {
            updateGameBoard();
        }
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
    enableCardClicks();
}

function calculateScore(deck, xeri) {
    let score = 0;
    deck.forEach(card => {
        if (['A', 'K', 'Q', 'J', '10'].includes(card.value)) {
            score += 1;
        }
    });
    if (deck.some(card => card.value === '10' && card.suit === '♦')) {
        score += 1;
    }
    if (deck.some(card => card.value === '2' && card.suit === '♣')) {
        score += 1;
    }
    xeri.forEach(card => {
        if (card.value === 'J') {
            score += 20;
        } else {
            score += 10;
        }
    });
    return score;
}

function endofgame() {
    // Add remaining cards on the table to the last player's deck
    if (lastPlayerToPickUp === 'Player 1') {
        deckP1.push(...deckMid);
        deckMid = []; // Clear the table

        // Show alert indicating the player picked up the last cards
        addMessage("Game Ended so Player 1 picked up the last cards!", 'green');
    } else if (lastPlayerToPickUp === 'Player 2') {
        deckP2.push(...deckMid);
        deckMid = []; // Clear the table

        // Show alert indicating the player picked up the last cards
        addMessage("Game Ended so Player 2 picked up the last cards!", 'green');
    }

    let scoreP1 = calculateScore(deckP1, xeriP1);
    let scoreP2 = calculateScore(deckP2, xeriP2);

    if (deckP1.length > deckP2.length) {
        scoreP1 += 3;
    } else if (deckP2.length > deckP1.length) {
        scoreP2 += 3;
    }

    // Update the 3rd box with all the cards in each player's deck
    const xeriP1Element = document.getElementById('xeriP1');
    xeriP1Element.innerHTML = deckP1.map(card => `<span class="${getCardColor(card)}">${card.value}${card.suit}</span>`).join(' ');

    const xeriP2Element = document.getElementById('xeriP2');
    xeriP2Element.innerHTML = deckP2.map(card => `<span class="${getCardColor(card)}">${card.value}${card.suit}</span>`).join(' ');

    setTimeout(() => {
        addMessage(`Final Scores:<br>Player 1: ${scoreP1} (Ξερή: ${xeriCountP1})<br>Player 2: ${scoreP2} (Ξερή: ${xeriCountP2})`, 'green');
        if (scoreP1 > scoreP2) {
            addMessage("Player 1 wins!", 'red');
        } else if (scoreP2 > scoreP1) {
            addMessage("Player 2 wins!", 'blue');
        } else {
            addMessage("It's a tie!", 'green');
        }
    }, 100);
}

function getCardColor(card) {
    if (['A', 'K', 'Q', 'J', '10'].includes(card.value) || (card.value === '10' && card.suit === '♦') || (card.value === '2' && card.suit === '♣')) {
        return 'red';
    }
    return 'black';
}

function addMessage(message, color) {
    const messageBoard = document.getElementById('messageBoard');
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.style.color = color;
    messageElement.classList.add('message');
    messageBoard.appendChild(messageElement);
}

function clearMessages() {
    const messageBoard = document.getElementById('messageBoard');
    messageBoard.innerHTML = '';
}
