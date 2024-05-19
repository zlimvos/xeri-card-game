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
    console.log("Game started");
}

function initializeGame() {
    // Create and shuffle the deck
    deck = createDeck();
    shuffleDeck(deck);

    // Reset hands, decks, and top card
    handP1 = [];
    handP2 = [];
    deckP1 = [];
    deckP2 = [];
    deckMid = [];
    TopCard = [];
    xeriP1 = [];
    xeriP2 = [];
    currentPlayer = 'Player 1';

    console.log("Game initialized");
    console.log(deck); // Print the shuffled deck
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

    console.log("Game board updated");
}

function playCard(player, idx, hand, deckPlayer, xeri, chosen_card) {
    // Logic to handle the card play
    if (deckMid.length === 1 && TopCard.length > 0 && (chosen_card.value === TopCard[0].value)) {
        alert(`${player} made a Ξερή with ${chosen_card.value} ${chosen_card.suit}`);
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
            alert(`${player} collects all cards from the table with ${chosen_card.value} ${chosen_card.suit}!`);
        }, 100); // Small delay to ensure the alert shows after the board updates
        lastPlayerToPickUp = player;
    } else {
        deckMid.push(chosen_card);
        TopCard[0] = deckMid[deckMid.length - 1];
    }

    hand.splice(idx, 1);

    // Update game board after the move
    updateGameBoard();
    switchPlayer();

    // Check if new deal is needed
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
    // 1 point for each face card (A, K, Q, J, 10)
    deck.forEach(card => {
        if (['A', 'K', 'Q', 'J', '10'].includes(card.value)) {
            score += 1;
        }
    });
    // 1 extra point for the 10 of Diamonds
    if (deck.some(card => card.value === '10' && card.suit === '♦')) {
        score += 1;
    }
    // 1 extra point for the 2 of Clubs
    if (deck.some(card => card.value === '2' && card.suit === '♣')) {
        score += 1;
    }
    // 10 points for each Ξερή, 20 points for each Ξερή with a Jack
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
    } else if (lastPlayerToPickUp === 'Player 2') {
        deckP2.push(...deckMid);
    }

    deckMid = []; // Clear the table

    let scoreP1 = calculateScore(deckP1, xeriP1);
    let scoreP2 = calculateScore(deckP2, xeriP2);

    if (deckP1.length > deckP2.length) {
        scoreP1 += 3;
    } else if (deckP2.length > deckP1.length) {
        scoreP2 += 3;
    }

    alert(`Final Scores:\nPlayer 1: ${scoreP1} (Ξερή: ${xeriCountP1})\nPlayer 2: ${scoreP2} (Ξερή: ${xeriCountP2})`);
    if (scoreP1 > scoreP2) {
        alert("Player 1 wins!");
    } else if (scoreP2 > scoreP1) {
        alert("Player 2 wins!");
    } else {
        alert("It's a tie!");
    }
}

document.getElementById('endGame').addEventListener('click', endofgame);
