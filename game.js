document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('twoPlayerMode').addEventListener('click', () => setGameMode('twoPlayer'));
    document.getElementById('computerMode').addEventListener('click', () => setGameMode('computer'));

    let handP1 = [];
    let handP2 = [];
    let deckP1 = [];
    let deckP2 = [];
    let deckMid = [];
    let topCard = [];
    let xeriP1 = [];
    let xeriP2 = [];
    let currentPlayer = 'Player 1';
    let deck = [];
    let lastPlayerToPickUp = null;
    let xeriCountP1 = 0;
    let xeriCountP2 = 0;
    let gameMode = 'twoPlayer';
    let isGameEnding = false;

    function setGameMode(mode) {
        gameMode = mode;
        document.getElementById('game-mode').style.display = 'none';
        if (mode === 'computer') {
            document.getElementById('player2Title').innerText = 'Xera.i.';
            document.getElementById('player2Label').innerText = 'Xera.i.';
        }
        showCardRevealModal();
    }

    function showCardRevealModal() {
        const cardRevealModal = document.getElementById('cardRevealModal');
        cardRevealModal.style.display = 'block';

        const card1 = getRandomCard();
        const card2 = getRandomCard();

        renderCard(card1, 'revealCard1');
        renderCard(card2, 'revealCard2');

        const player1Value = getCardValue(card1);
        const player2Value = getCardValue(card2);
        let startingPlayer = '';

        if (player1Value > player2Value) {
            startingPlayer = 'Player 1';
            currentPlayer = 'Player 1';
        } else if (player2Value > player1Value) {
            startingPlayer = gameMode === 'computer' ? 'Xera.i.' : 'Player 2';
            currentPlayer = 'Player 2';
        } else {
            startingPlayer = 'Tie! Re-roll!';
            setTimeout(showCardRevealModal, 3000); // Re-roll if it's a tie
            return;
        }

        document.getElementById('startingPlayerMessage').textContent = `${startingPlayer} starts!`;

        setTimeout(() => {
            cardRevealModal.style.display = 'none';
            startGame();
        }, 3000);
    }

    function getRandomCard() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        return { value: values[Math.floor(Math.random() * values.length)], suit: suits[Math.floor(Math.random() * suits.length)] };
    }

    function getCardValue(card) {
        const cardValues = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        return cardValues[card.value];
    }

    function getSuitSymbol(suit) {
        switch (suit) {
            case '♠':
                return '&spades;';
            case '♥':
                return '&hearts;';
            case '♦':
                return '&diams;';
            case '♣':
                return '&clubs;';
            default:
                return '';
        }
    }

    function renderCard(card, elementId) {
        const suitClass = card.suit === '♦' ? 'diams' : card.suit === '♥' ? 'hearts' : card.suit === '♠' ? 'spades' : 'clubs';
        const cardElement = document.getElementById(elementId);
        cardElement.className = `card rank-${card.value.toLowerCase()} ${suitClass}`;
        cardElement.innerHTML = `
            <span class="rank">${card.value}</span>
            <span class="suit">${getSuitSymbol(card.suit)}</span>
            <span class="rank bottom-right">${card.value}</span>
            <span class="suit bottom-right-suit">${getSuitSymbol(card.suit)}</span>
        `;
    }

    function startGame() {
        initializeGame();
        firstDeal();
        updateGameBoard();
        enableCardClicks();
        document.getElementById('game-board').style.display = 'flex';
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
        topCard = [];
        xeriP1 = [];
        xeriP2 = [];
        xeriCountP1 = 0;
        xeriCountP2 = 0;
        lastPlayerToPickUp = null;
        isGameEnding = false;
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
            if (gameMode === 'computer') {
                setTimeout(() => playComputerMove(), 1000);
            }
        }
    }

    function createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
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
            topCard.push(deckMid[deckMid.length - 1]);
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
        console.log("Updating game board...");

        // Update Player 1's hand
        const handP1Element = document.getElementById('handP1');
        handP1Element.innerHTML = '';
        handP1.forEach((card, idx) => {
            const suitClass = card.suit === '♦' ? 'diams' : card.suit === '♥' ? 'hearts' : card.suit === '♠' ? 'spades' : 'clubs';
            const cardElement = document.createElement('div');
            cardElement.className = `card rank-${card.value.toLowerCase()} ${suitClass}`;
            cardElement.innerHTML = `
                <span class="rank">${card.value}</span>
                <span class="suit">${getSuitSymbol(card.suit)}</span>
                <span class="rank bottom-right">${card.value}</span>
                <span class="suit bottom-right-suit">${getSuitSymbol(card.suit)}</span>
            `;
            cardElement.style.zIndex = idx; // Set z-index to avoid overlapping
            cardElement.addEventListener('click', () => playCard('Player 1', idx, handP1, deckP1, xeriP1, card));
            handP1Element.appendChild(cardElement);
            console.log(`Player 1 card: ${card.value} of ${card.suit}`);
        });

        // Update Player 2's hand (hidden if playing against computer)
        const handP2Element = document.getElementById('handP2');
        handP2Element.innerHTML = '';
        handP2.forEach((card, idx) => {
            const suitClass = card.suit === '♦' ? 'diams' : card.suit === '♥' ? 'hearts' : card.suit === '♠' ? 'spades' : 'clubs';
            const cardElement = document.createElement('div');
            if (gameMode === 'twoPlayer') {
                cardElement.className = `card rank-${card.value.toLowerCase()} ${suitClass}`;
                cardElement.innerHTML = `
                    <span class="rank">${card.value}</span>
                    <span class="suit">${getSuitSymbol(card.suit)}</span>
                    <span class="rank bottom-right">${card.value}</span>
                    <span class="suit bottom-right-suit">${getSuitSymbol(card.suit)}</span>
                `;
                cardElement.style.zIndex = idx; // Set z-index to avoid overlapping
                cardElement.addEventListener('click', () => playCard('Player 2', idx, handP2, deckP2, xeriP2, card));
                console.log(`Player 2 card: ${card.value} of ${card.suit}`);
            } else {
                cardElement.className = `card back`;
                console.log("Player 2 card: hidden");
            }
            handP2Element.appendChild(cardElement);
        });

        // Update the mid deck
        const deckMidElement = document.getElementById('deckMid');
        deckMidElement.innerHTML = '';
        deckMid.forEach((card, idx) => {
            const suitClass = card.suit === '♦' ? 'diams' : card.suit === '♥' ? 'hearts' : card.suit === '♠' ? 'spades' : 'clubs';
            const cardElement = document.createElement('div');
            cardElement.className = `card rank-${card.value.toLowerCase()} ${suitClass}`;
            cardElement.innerHTML = `
                <span class="rank">${card.value}</span>
                <span class="suit">${getSuitSymbol(card.suit)}</span>
                <span class="rank bottom-right">${card.value}</span>
                <span class="suit bottom-right-suit">${getSuitSymbol(card.suit)}</span>
            `;
            const stackNumber = Math.floor(idx / 10); // Calculate which stack the card belongs to
            const positionInStack = idx % 10; // Position within the stack
            cardElement.style.setProperty('--i', `${positionInStack}`); // Set position in the stack
            cardElement.style.setProperty('--stack', `${stackNumber}`); // Set stack number for horizontal offset
            cardElement.style.zIndex = idx; // Set z-index to avoid overlapping
            deckMidElement.appendChild(cardElement);
            console.log(`Table card: ${card.value} of ${card.suit}`);
        });

        // Update deck counts
        updateDeckCounts();

        console.log("Game board updated");
    }

    function updateDeckCounts() {
        console.log("Updating deck counts...");
        // Update Player 1's deck count and Xeri count
        const deckP1Element = document.getElementById('deckP1');
        deckP1Element.innerHTML = `Deck: ${deckP1.length} cards<br>Ξερή: ${xeriCountP1}`;

        // Update Player 2's deck count and Xeri count
        const deckP2Element = document.getElementById('deckP2');
        deckP2Element.innerHTML = `Deck: ${deckP2.length} cards<br>Ξερή: ${xeriCountP2}`;

        console.log("Deck counts updated");
    }

    function playCard(player, idx, hand, deckPlayer, xeri, chosen_card) {
        if (deckMid.length === 1 && topCard.length > 0 && (chosen_card.value === topCard[0].value)) {
            addMessage(`${player} made a Ξερή with ${chosen_card.value} ${chosen_card.suit}`, player);
            xeri.push(chosen_card);
            deckPlayer.push(...deckMid, chosen_card);
            deckMid = [];
            topCard = [];
            lastPlayerToPickUp = player;
            if (player === 'Player 1') {
                xeriCountP1++;
            } else {
                xeriCountP2++;
            }
        } else if (topCard.length > 0 && (chosen_card.value === 'J' || chosen_card.value === topCard[0].value)) {
            deckPlayer.push(...deckMid, chosen_card);
            let cardsCollected = deckMid.length;
            deckMid = [];
            topCard = [];
            setTimeout(() => {
                addMessage(`${player} collects ${cardsCollected} cards from the table with ${chosen_card.value} ${chosen_card.suit}`, player);
            }, 100);
            lastPlayerToPickUp = player;
        } else {
            deckMid.push(chosen_card);
            topCard[0] = deckMid[deckMid.length - 1];
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

    function playComputerMove() {
        const validMoves = [];
        let xeriMove = null;

        handP2.forEach((card, idx) => {
            if (topCard.length > 0) {
                if (card.value === topCard[0].value) {
                    xeriMove = { card, idx };
                }
                if (card.value === 'J') {
                    validMoves.push({ card, idx });
                }
            }
        });

        if (xeriMove) {
            playCard('Xera.i.', xeriMove.idx, handP2, deckP2, xeriP2, xeriMove.card);
        } else if (validMoves.length > 0) {
            const move = validMoves[Math.floor(Math.random() * validMoves.length)];
            playCard('Xera.i.', move.idx, handP2, deckP2, xeriP2, move.card);
        } else {
            const randomIdx = Math.floor(Math.random() * handP2.length);
            playCard('Xera.i.', randomIdx, handP2, deckP2, xeriP2, handP2[randomIdx]);
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
        isGameEnding = true;

        if (lastPlayerToPickUp === 'Player 1') {
            deckP1.push(...deckMid);
            deckMid = [];

            addMessage("Game Ended so Player 1 picked up the last cards!", 'Player 1');
        } else if (lastPlayerToPickUp === 'Player 2' || lastPlayerToPickUp === 'Xera.i.') {
            deckP2.push(...deckMid);
            deckMid = [];

            addMessage("Game Ended so Player 2 picked up the last cards!", 'Player 2');
        }

        // Add this line to clear the table visually
        updateGameBoard();

        let scoreP1 = calculateScore(deckP1, xeriP1);
        let scoreP2 = calculateScore(deckP2, xeriP2);

        if (deckP1.length > deckP2.length) {
            scoreP1 += 3;
        } else if (deckP2.length > deckP1.length) {
            scoreP2 += 3;
        }

        const handP1Element = document.getElementById('handP1');
        handP1Element.innerHTML = deckP1.map(card => `<span class="${getSuitClass(card.suit)}">${card.value}${getSuitSymbol(card.suit)}</span>`).join(' ');

        const handP2Element = document.getElementById('handP2');
        handP2Element.innerHTML = deckP2.map(card => `<span class="${getSuitClass(card.suit)}">${card.value}${getSuitSymbol(card.suit)}</span>`).join(' ');

        setTimeout(() => {
            addMessage(`Final Scores:<br>Player 1: ${scoreP1} (Ξερή: ${xeriCountP1})<br>Player 2: ${scoreP2} (Ξερή: ${xeriCountP2})`, 'green');
            if (scoreP1 > scoreP2) {
                addMessage("Player 1 wins!", 'red');
            } else if (scoreP2 > scoreP1) {
                addMessage("Player 2 wins!", 'blue');
            } else {
                addMessage("It's a tie!", 'green');
            }
        
            displayFinalScoresInTable(scoreP1, scoreP2, xeriCountP1, xeriCountP2);

        }, 100);
    }

    function getSuitClass(suit) {
        switch (suit) {
            case '♠':
                return 'spades';
            case '♥':
                return 'hearts';
            case '♦':
                return 'diams';
            case '♣':
                return 'clubs';
            default:
                return '';
        }
    }

    function addMessage(message, player) {
        const messageBox = document.getElementById('messageBoxContent');
        const messageElement = document.createElement('div');

        // Create a text node for the rest of the message
        let messageText = message;

        // If player is provided, wrap their name in a span with the appropriate color
        if (player) {
            const playerColor = player === 'Player 1' ? 'darkred' : player === 'Player 2' ? 'darkblue' : 'green';
            const playerSpan = `<span style="color:${playerColor}">${player}</span>`;
            messageText = messageText.replace(player, playerSpan);
        }

        // Set the innerHTML of the message element to the formatted message text
        messageElement.innerHTML = messageText;

        messageBox.appendChild(messageElement);
        messageBox.scrollTop = messageBox.scrollHeight;
    }

    function setCardStyles(spread, spacing) {
        document.documentElement.style.setProperty('--spread', `${spread}deg`);
        document.documentElement.style.setProperty('--spacing', `${spacing}%`);
    }

    setCardStyles(0, -30);
});

function displayFinalScoresInTable(scoreP1, scoreP2, xeriCountP1, xeriCountP2) {
    const deckMidElement = document.getElementById('deckMid');
    let winnerMessage = "";

    if (scoreP1 > scoreP2) {
        winnerMessage = "Player 1 wins!";
    } else if (scoreP2 > scoreP1) {
        winnerMessage = "Player 2 wins!";
    } else {
        winnerMessage = "It's a tie!";
    }

    deckMidElement.innerHTML = `
        <div class="final-scores">
            <p>Final Scores:</p>
            <p>Player 1: ${scoreP1} (Ξερή: ${xeriCountP1})</p>
            <p>Player 2: ${scoreP2} (Ξερή: ${xeriCountP2})</p>
            <p>${winnerMessage}</p>
        </div>
    `;
}
