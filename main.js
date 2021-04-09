console.log('loaded')
var canvas = document.getElementById("html-canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var centre = {x: canvas.width/2, y:canvas.height/2};  
var nameRadius = canvas.height*2/5;
var ctx = canvas.getContext("2d");
var deck;
var players = [];
var activePlayer = 0;
var currentCard = {suit: 'N', value: 'N'};
var cardImages = {}
var cardSize = {x: 230, y: 352};
ctx.font = "30px Arial"

var background = new Image();
background.src = "media/background.png";

var cardBack = new Image();
cardBack.src = "media/cards/PNG/red_back.png";

var mPos = {x: 0, y: 0};

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

canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    mPos.x = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
    mPos.y = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make
});

canvas.addEventListener("mousedown", function(e) {
    mouseClicked();
});


document.getElementById("addPlayerName").addEventListener("keydown", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === 'Enter') {
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
        players.push({name: nameValue, x: 0, y: 0});
        document.getElementById('addPlayerName').value = '';
        console.log(players);
        updatePlayers();
    }
    
}

function removePlayer(playerName) {
    players = players.filter(function(player) {
        return player.name !== playerName;
    })
    updatePlayers();
}

function updatePlayers() {
    var step = Math.PI*2/players.length;
    for (var i = 0; i < players.length; i++) {      
        var angle = i*step;      
        players[i].x = centre.x + nameRadius*Math.cos(angle);
        players[i].y = centre.y + nameRadius*Math.sin(angle);   
    }
    refresh();
}

function drawCard() {
    activePlayer = (activePlayer + 1) % players.length;
    if (deck.cards.length == 0) {
        alert("No more cards!");
        resetGame();
    }
    currentCard = deck.deal();
	refresh();
}

function getMsg(val) {
	var msg = "";
	switch (val) {
		case "A":
			msg = "Waterfall!";
			break;
		case 2:
			msg = "Two is you";
			break;
		case 3:
			msg = "Three is me";
			break;
		case 4:
			msg = "Four is whores";
			break;
		case 5:
			msg = "Thumbmaster!";
			break;
		case 6:
			msg = "Six is dicks";
			break;
		case 7:
			msg = "Seven is heaven";
			break;
		case 8:
			msg = "Eight is mates";
			break;
		case 9:
			msg = "Nine is rhymes";
			break;
		case 10:
			msg = "Ten is categories";
			break;
		case "J":
			msg = "Make a new rule";
			break;
		case "Q":
			msg = "Questionmaster!"
			break;
		case "K":
			var numKings = 0;
			deck.cards.forEach(function countKings(value) {
				if (value.value == "K") {
					numKings++;
				}
			})
			if (numKings == 0) {
				msg = "No more kings"
			}
			else {
				msg = `There are ${numKings} kings left in the deck.`;
			}
			break;
			
	}
	return msg;
}


function resetGame() {
  deck.reset();
  activePlayer = -1;
  currentCard = {suit: 'N', value: 'N'};
  refresh();
}

function refresh() {
    console.log("refreshing!");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    var cardID = currentCard.value + currentCard.suit;
    if (cardID == "NN") {
	    ctx.drawImage(cardBack, centre.x-(cardSize.x/2), centre.y-(cardSize.y/2), cardSize.x, cardSize.y);
    }
    else {
        ctx.drawImage(cardImages[cardID], centre.x-(cardSize.x/2), centre.y-(cardSize.y/2), cardSize.x, cardSize.y);
    }
  
    ctx.textAlign = 'center';
    for (var i = 0; i < players.length; i++) {  
        ctx.font = "30px Arial"
        ctx.fillStyle = "#FFFFFF";
        //Draw stroke around names
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(players[i].name, players[i].x, players[i].y);

        if (i == activePlayer) {
            //Set colour for active player to red
            ctx.fillStyle = "#FF0000";
        }
        //Draw names
        ctx.fillText(players[i].name, players[i].x, players[i].y);    
    }
  
    //Display current rule
    ctx.lineWidth = 4;
    ctx.strokeText(getMsg(currentCard.value), canvas.width/2 ,canvas.height-30);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(getMsg(currentCard.value), canvas.width/2 ,canvas.height-30);  
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
    });
}


function mouseClicked() {
    console.log(`Clicked! ${mPos.x}/${mPos.y}`);
    //card check
    if (mPos.x > (centre.x - cardSize.x/2) && mPos.x < (centre.x + cardSize.x/2) &&
        mPos.y > (centre.y - cardSize.y/2) && mPos.y < (centre.y + cardSize.y/2)) {
            drawCard();
        }
    //player check
    else {
        for (var i = 0; i < players.length; i++) {      
            var nameWidth = ctx.measureText(players[i].name).width;
            if (mPos.x > (players[i].x - nameWidth/2) && mPos.x < (players[i].x + nameWidth/2) &&
                mPos.y > (players[i].y - 10) && mPos.y < (players[i].y + 10)) {  
                    if (confirm(`Remove ${players[i].name}?`)) {
                        removePlayer(players[i].name);
                    };
                }  
        }
    }
}

window.onload = resetGame;