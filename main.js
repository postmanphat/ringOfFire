console.log('loaded')
var canvas = document.getElementById("html-canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var nameRadius = canvas.height*2/5;
var context = canvas.getContext("2d");
var deck;
var players = [];
var activePlayer = -1;
var currentCard = {suit: 'N', value: 'N'};
var cardImages = {}
var cardSize = {x: 230, y: 352};

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

//Event handling

document.getElementById("addPlayerBttn").onclick = function() {addPlayer()};
document.getElementById("drawCardBttn").onclick = function() {drawCard()};
document.getElementById("resetBttn").onclick = function() {resetGame()};

document.getElementById("addPlayerName").addEventListener("keydown", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("addPlayerBttn").click();
  }
});


function addPlayer() {
    var nameValue = document.getElementById("addPlayerName").value;
    if (nameValue == "") {
        alert("No name inputted");
    }
    else {
        players.push(nameValue);
        document.getElementById('addPlayerName').value = '';
        console.log(players);
        refresh();
    }
    
}

function drawCard() {
    activePlayer = (activePlayer + 1) % players.length;
    currentCard = deck.deal();
    if (currentCard.value == "K") {
        var numKings = 0;
        deck.cards.forEach(function countKings(value) {
            if (value.value == "K") {
                numKings++;
            }
        })
        console.log(`There are ${numKings} kings left in the deck.`);
        refresh();
        context.font = "20px Arial"
        context.fillStyle = "#FFFFFF";
        context.fillText(`There are ${numKings} kings left in the deck.`, canvas.width/2 ,canvas.height-30);
    }
    else {
        refresh();
    }
}

function resetGame() {
  deck.reset();
  activePlayer = -1;
  currentCard = {suit: 'N', value: 'N'};
  refresh();
}

function refresh() {
  console.log("refreshing!");
  context.clearRect(0, 0, canvas.width, canvas.height);
  //Draw names
  var step = Math.PI*2/players.length;
  var centre = {x: canvas.width/2, y:canvas.height/2};  
  var cardID = currentCard.value + currentCard.suit;
  console.log(`card is ${cardID}`);
  context.fillStyle = "#FFFFFF"
  context.textAlign = 'center';
  //context.fillText(`${currentCard.value} of ${currentCard.suit}`, centre.x, centre.y);
  if (cardID != "NN") {
	context.drawImage(cardImages[cardID], centre.x-(cardSize.x/2), centre.y-(cardSize.y/2), cardSize.x, cardSize.y);
  }
  

  for (var i = 0; i < players.length; i++) {
      
      var angle = i*step;      
      var dX = nameRadius*Math.cos(angle);
      var dY = nameRadius*Math.sin(angle);
    
      context.font = "30px Arial"
      context.fillStyle = "#FFFFFF";
      if (i == activePlayer) {
        context.fillStyle = "#FF0000";
      }
      context.fillText(players[i], centre.x+dX, centre.y+dY);    
  }
}

function setup() {
    //Adding cards
    deck = new Deck;
    //Adding images
    loadImages();
}

function loadImages() {
  deck.cards.forEach(function loadImg(value) {
       var cardID = value.value + value.suit;
       cardImages[cardID] = new Image();
       cardImages[cardID].src = 'media/cards/PNG/' + cardID + '.png';
})};
