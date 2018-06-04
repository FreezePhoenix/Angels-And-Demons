  class TurnManager {
    constructor(){
      this.turnNumber = -1
    }
    nextTurn(){
      this.turnNumber++
    }
  }
  class Deck {
    constructor(isHand, manaManager){
      this.cards = {};
      this.currentId = 0;
      this.isHand = isHand;
      this.manaManager = manaManager;
      this.enemy = [];
      this.IDofCardSelected = -1
    }
    enableEnemyDeck(){
      this.enemyDeck.ArrayOfCardIDs.forEach( (cardID) => {
        this.enemyDeck.cards[cardID].locked = false;
      });
    }
    disableEnemyDeck(){
      this.enemyDeck.ArrayOfCardIDs.forEach( (cardID) => {
        this.enemyDeck.cards[cardID].locked = true;
      });
    }
    get ArrayOfCards(){
      return Object.keys(this.cards).map(ID=>this.cards[ID])
    }
    get ArrayOfCardIDs(){
      return Object.keys(this.cards)
    }
    attack(){
      var opponentCardID = this.enemyDeck.IDofCardSelected
      var yourCardID = this.IDofCardSelected
      if(yourCardID+1 && opponentCardID+1 && !this.enemyDeck.cards[opponentCardID].used && !this.cards[this.IDofCardSelected].isLand && !this.cards[this.IDofCardSelected].isPrimal){  // the opponent is always the person who attacks.
        this.enemyDeck.cards[opponentCardID].health -= this.cards[yourCardID].attack
        this.cards[yourCardID].health -= this.enemyDeck.cards[opponentCardID].attack
        this.enemyDeck.cards[opponentCardID].used = true
        this.enemyDeck.cards[opponentCardID].selected = false
        this.enemyDeck.IDofCardSelected = -1
        this.IDofCardSelected = -1
        this.enemyDeck.manaManager.mana -= this.enemyDeck.cards[opponentCardID].manaCost
        this.ArrayOfCards.forEach( (card) => {
          if( card.health <= 0 && card.health !== null ) {
            this.removeCards(card)
          }
        })
      }
    }
    addCards(...cards){
      cards.forEach( (card)=>{
        this.isHand ? card.inHand = true : card.inHand = false;
        card.ID = this.currentId;;
        this.cards[this.currentId] = card;
        this.currentId++;
      });
    }
    removeCards(...cards){
      cards.forEach((card)=>{
        delete this.cards[card.ID]
      });
    }
    Lockdown(...cards){
      this.ArrayOfCardIDs.forEach( (cardID) => {
        this.cards[cardID].locked = true;
        this.cards[cardID].selected = false;
      });
      cards.forEach( (item) => {
        this.cards[item.ID].locked = false;
      });
    }
    OpenUp(){
      this.ArrayOfCardIDs.forEach( (cardID) => {
        this.cards[cardID].locked = false;
      });
    }
  }
  class Card {
    constructor(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn){
      Object.assign(this, {
        maxHealth: maxHealth,
        attack: attack,
        nameColor: nameColor,
        manaCost: manaCost,
        name: name,
        inHand: inHand,
        deck: deck,
        manaManager: deck.manaManager,
        manaPerTurn: manaPerTurn,
        hand: hand,
        decks: [playerDeck, enemyDeck],
        selected: false,
        locked: false,
        used: false,
        health: maxHealth
      });
    }
    get isLand() {
      return this instanceof Land
    }
    get isPrimal() {
      return this instanceof Primal
    }
    onclick() {
      if( !this.used ) {
        if( turnManager.turnNumber % 2 === this.decks.indexOf(this.deck)) {
          if ( this.manaManager.mana >= (this.manaCost === "N/A" ? 0 : this.manaCost) && !(this instanceof Land)) {
            if( this instanceof Primal ) {
              enemyWins();
            } else if (!this.selected) {
              this.deck.Lockdown(this);
              this.toggleSelected();
              this.deck.enableEnemyDeck();
              this.deck.IDofCardSelected = this.ID;
            } else if ( this.selected ) {
              this.toggleSelected();
              this.deck.OpenUp();
              this.deck.disableEnemyDeck();
              this.deck.IDofCardSelected = -1;
            };
          };
        } else if ( turnManager.turnNumber % 2 === Number(!this.decks.indexOf(this.deck)) ) {
          this.deck.IDofCardSelected = this.ID;
          this.deck.attack();
          this.deck.enemyDeck.OpenUp();
        };
      };
    }
    summon() {
      if(this.summonCost <= this.manaManager.mana && turnManager.turnNumber % 2 === this.decks.indexOf(this.deck)) {
        new Promise( (r) => {
          this.toggleSelected();setTimeout(r,10);
        }).then( () => {
          if( turnManager.turnNumber % 2 === this.decks.indexOf(this.deck) ) {
            if( confirm('Are you sure you want to summon this card?') ) {
              this.hand.manaManager.mana -= this.summonCost === "N/A" ? 0 : this.summonCost;
              delete this.hand.cards[this.id];
              this.deck.addCards(this);
              this.inHand = false;
              this.used = true; // summoning sickness.
            };
          };
          
        }).then( () => {
          this.toggleSelected();
        });
      }
    }
    toggleSelected(){
      this.selected = !this.selected;
    }
    get style(){
      return `width: ${this.health / this.maxHealth * 100}; background-color: ${this.barColor};`
    }
    get barColor(){
      var r = 255 - (this.health/this.maxHealth) * 255;
      var g = (this.health/this.maxHealth) * 255;
      return `rgb(${Math.floor(r)}, ${Math.floor(g)}, 0)`;
    }
    get id(){
      return this.ID;
    }
  }
  class ManaManager {
    constructor(deck){
      this.mana = 20;
      this.deck = deck;
    }
    get maxMana(){
      return 20 + this.deck.ArrayOfCards.map(function(i){return (i instanceof Land) ? i.manaPerTurn : 0 }).reduce((a,b)=>a+b) 
    }
    get manaBarWidth() {
      return Math.floor(this.mana/this.maxMana*100);
    }
    get manaPerTurn(){
      var result = 0
      Object.keys(this.deck.cards).map(i=>this.deck.cards[i]).forEach((card)=> {
        result += card.manaPerTurn == "N/A" ? 0 : card.manaPerTurn;
      });
      return result;
    }
  }
  class Primal extends Card {
    constructor(hand, deck, name) {
      super(null, "N/A", "#DD00DD", 30, name, true, hand, deck, "N/A")
      this.summonCost = 0
    }
  }
  class Land extends Card{
    constructor(manaPerTurn, name, nameColor, inHand, hand, deck){
      super(null, "N/A", nameColor, "N/A", name,deck.isHand, hand, deck, manaPerTurn);
      this.summonCost = 0
    }
  }