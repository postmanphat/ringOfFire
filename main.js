console.log('loaded')
var canvas = document.getElementById("html-canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var context = canvas.getContext("2d");
var deck;
var players = [];

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }

    getSuit() {
        return this.value;
    }

    getValue() {
        return this.value;
    }
}

class Deck {
    constructor() {
        this.cards = buildDeck();        
    }

    shuffle() {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
    }

    deal() {
        const dealtCard = this.cards[Math.floor(Math.random() * this.cards.length)];
        this.cards = this.cards.filter(e => !(e.suit == dealtCard.suit && e.value == dealtCard.value));
        return dealtCard;
    }

    reset() {
        this.cards = buildDeck();
    }

}

function buildDeck() {
    var suits = ['C', 'D', 'H', 'S'];
    var newCards = [];
    //To be clear, value in genCards is named as such because js forEach functions
    //need special parameter names. It is the suit, not the card value
    suits.forEach(function genCards(value) {
        newCards.push(new Card(value, 'A'));
        for (var i = 2; i < 11; i++) {
            newCards.push(new Card(value, i));
        }
        newCards.push(new Card(value, 'J'));
        newCards.push(new Card(value, 'Q'));
        newCards.push(new Card(value, 'K'));

    })
    return newCards;
}

setup()
console.log(deck);


document.getElementById("addPlayerBttn").onclick = function() {addPlayer()};

function addPlayer() {
    var nameValue = document.getElementById("addPlayerName").value;
    players.push(nameValue);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function setup() {
    //Adding cards
    deck = new Deck;

}