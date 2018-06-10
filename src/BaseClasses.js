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
      Object.assign(this, {
        cards: Object.setPrototypeOf({}, null),
        currentId: 0,
        isHand: isHand,
        manaManager: manaManager,
        enemy: [],
        selectedCardID: -1
      })
      if(manaManager){
       this.hand = this.isHand ? this : this.manaManager.deck
       this.deck = this.isHand ? this.manaManager.deck : this
      }
    }
    addCardFromWeights(weights){
      var newCard = getRandomItem(weights)
      this.addCards(new newCard(this.hand, this.deck))
      weights.splice(weights.indexOf(newCard),1)
    }
    get selectedCard(){
      return this.cards[this.selectedCardID]
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
      return Object.values(this.cards);
    }
    get ArrayOfCardIDs(){
      return Object.keys(this.cards);
    };
    attack(){
      // the opponent is always the person who attacks.
      
      var opponentCardID = this.enemyDeck.selectedCardID,
          opponentCard = this.enemyDeck.selectedCard,
          yourCardID = this.selectedCardID,
          yourCard = this.selectedCard
      
      if(yourCardID + 1 && opponentCardID + 1 && !opponentCard.used && !this.isLand && !this.isPrimal){
        opponentCard.health -= yourCard.attack;
        yourCard.health -= opponentCard.attack;
        Object.assign(opponentCard, {
          used: true,
          selected: false
        });
        this.enemyDeck.IDofCardSelected = -1;
        this.IDofCardSelected = -1;
        this.enemyDeck.manaManager.mana -= opponentCard.manaCost;
        this.ArrayOfCards.forEach( (card) => {
          if( card.health <= 0 && card.health !== null ) {
            this.removeCards(card);
          };
        });
      }
    };
    addCards(...cards){
      cards.forEach( (card) => {
        this.isHand ? card.inHand = true : card.inHand = false;
        card.ID = this.currentId;
        this.cards[this.currentId] = card;
        this.currentId++;
      });
    };
    removeCards(...cards){
      cards.forEach( (card) => {
        delete this.cards[card.ID];
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
        maxHealth: maxHealth, health: maxHealth,
        attack: attack, name: name,
        nameColor: nameColor,
        inHand: inHand, deck: deck,
        manaCost: manaCost, manaManager: deck.manaManager, manaPerTurn: manaPerTurn,
        hand: hand, decks: [playerDeck, enemyDeck],
        selected: false, locked: false, used: false
      });
    }
    get isLand() {
      return this instanceof Land;
    }
    get isPrimal() {
      return this instanceof Primal;
    }
    onclick() {
      if( !this.used ) {
        if( turnManager.turnNumber % 2 === this.decks.indexOf(this.deck)) {
          if ( this.manaManager.mana >= (this.manaCost === "N/A" ? 0 : this.manaCost) && !this.isLand ) {
            if( this instanceof Primal ) {
              enemyWins();
            } else if (!this.selected) {
              this.deck.Lockdown(this);
              this.toggleSelected();
              this.deck.enableEnemyDeck();
              this.deck.selectedCardID = this.ID;
            } else if ( this.selected ) {
              this.toggleSelected();
              this.deck.OpenUp();
              this.deck.disableEnemyDeck();
              this.deck.selectedCardID = -1;
            };
          };
        } else if ( turnManager.turnNumber % 2 === Number(!this.decks.indexOf(this.deck)) ) {
          this.deck.selectedCardID = this.ID;
          this.deck.attack();
          this.deck.enemyDeck.OpenUp();
          
              this.toggleSelected();
        };
      };
    }
    summon() {
      if(this.summonCost <= this.manaManager.mana && turnManager.turnNumber % 2 === this.decks.indexOf(this.deck)) {
        if( turnManager.turnNumber % 2 === this.decks.indexOf(this.deck) ) {
          if( confirm('Are you sure you want to summon this card?') ) {
            this.hand.manaManager.mana -= this.summonCost === "N/A" ? 0 : this.summonCost;
            delete this.hand.cards[this.id];
            Object.assign(this, {
              inHand: false,
              used: true // summoning sickness
            });
            this.deck.addCards(this);
          };
        };
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
      return 20 + this.deck.ArrayOfCards.map( (i) => (i instanceof Land ? i.manaPerTurn : 0) ).reduce( (totalManaPerTurn,cardManaPerTurn) => {
        return totalManaPerTurn + cardManaPerTurn
      }); 
    }
    get manaBarWidth() {
      return Math.floor(this.mana/this.maxMana*100);
    }
    get manaPerTurn(){
      var result = this.deck.ArrayOfCards.reduce( (accumulator, card) => { 
        return accumulator + (card.manaPerTurn === "N/A" ? 0 : card.manaPerTurn);
      }, 0);
      return result
    }
    set manaGain(mana) {
      this.mana += mana
      if(this.mana > this.maxMana) {
        this.mana = this.maxMana
      };
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