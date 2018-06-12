class TurnManager {
  constructor() {
    this.turnNumber = -1;
  };
  nextTurn() {
    this.turnNumber++;
  };
};
class Effect {
  constructor(value, turns, name, netValueWhenDone) {
    Object.assign(this, {
      value: value,
      turns: turns,
      name: name,
      netValueWhenDone: netValueWhenDone
    });
  }
  apply(card) {
    card.activeEffects[this.name] = {}
    Object.assign(card.activeEffects[this.name], {
       value: this.value,
       turns: this.turns,
       netValueWhenDone: this.netValueWhenDone,
       remainingTurns: this.turns,
       name: this.name
    })
  }
}
class Deck {
  constructor(isHand, manaManager, weights) {
    var cards = {}
    Object.assign(this, {
      cards: Array(10).fill().map( () => new BlankCard ),
      currentId: 1,
      isHand: isHand,
      manaManager: manaManager,
      selectedCardID: -1,
      weights: weights ? expandWeights(weights) : undefined
    });
    if (manaManager) {
      this.hand = this.isHand ? this : this.manaManager.deck;
      this.deck = this.isHand ? this.manaManager.deck : this;
    };
  };
  sealCards() {
    Object.seal(this.cards);
  };
  updateEffects() {
    this.cards.forEach( (card) => {
      Object.values(card.activeEffects).forEach( (effect) => {
        let isNew = effect.turns === effect.remainingTurns
        if( isNew ) {
          card[effect.name] += effect.value;
        } else if ( effect.remainingTurns === 0 ) {
          card[effect.name] -= effect.value - effect.netValueWhenDone;
          delete card.activeEffects[effect.name]
        };
        effect.remainingTurns--;
      });
    });
  };
  addCardFromWeights() {
    var newCard = getRandomItem(this.weights);
    this.addCards(new newCard(this.hand, this.deck));
    this.weights.splice(this.weights.indexOf(newCard), 1);
  };
  get selectedCard() {
    return this.cards[this.selectedCardID];
  };
  enableEnemyDeck() {
    this.enemyDeck.ArrayOfCardIDs.forEach((cardID) => {
      this.enemyDeck.cards[cardID].locked = false;
    });
  };
  disableEnemyDeck() {
    this.enemyDeck.ArrayOfCardIDs.forEach((cardID) => {
      this.enemyDeck.cards[cardID].locked = true;
    });
  };
  get ArrayOfCards() {
    return Object.values(this.cards);
  };
  get ArrayOfCardIDs() {
    return Object.keys(this.cards);
  };
  attack() {
    // the opponent is always the person who attacks.

    var opponentCardID = this.enemyDeck.selectedCardID,
      opponentCard = this.enemyDeck.selectedCard,
      yourCardID = this.selectedCardID,
      yourCard = this.selectedCard;

    if (yourCardID + 1 && opponentCardID + 1 && !opponentCard.used && !yourCard.isLand && !yourCard.isPrimal) {
      opponentCard.health -= (yourCard.attack === "N/A" ? 0 : yourCard.attack);
      yourCard.health -= (opponentCard.attack === "N/A" ? 0 : yourCard.attack);
      Object.assign(opponentCard, {
        used: true,
        selected: false
      });
      if( opponentCard.effects ) {
        Object.values(opponentCard.effects).forEach( (item) => {
          item.apply(yourCard)
        })
      }
      this.enemyDeck.selectedCardID = -1;
      this.selectedCardID = -1;
      this.enemyDeck.manaManager.mana -= opponentCard.manaCost;
      this.ArrayOfCards.forEach((card) => {
        if (card.health <= 0 && card.health !== null) {
          this.removeCards(card);
        };
      });
    };
  };
  addCards(...cards) {
    var emptyCardIDs = this.cards.filter( item => item.name === null ).map( item => this.cards.indexOf(item));
    cards.forEach( (card) => {
      this.isHand ? card.inHand = true : card.inHand = false;
      card.ID = emptyCardIDs[0];
      this.cards[emptyCardIDs[0]].propogate(card);
      emptyCardIDs.shift();
    });
  };
  removeCards(...cards) {
    cards.forEach((card) => {
       this.cards[card.ID].propogate(new BlankCard);
    });
  };
  Lockdown(...cards) {
    this.ArrayOfCardIDs.forEach((cardID) => {
      this.cards[cardID].locked = true;
    });
    cards.forEach((item) => {
      this.cards[item.ID].locked = false;
    });
  };
  OpenUp() {
    this.ArrayOfCardIDs.forEach((cardID) => {
      this.cards[cardID].locked = false;
    });
  };
};
class Card {
  constructor(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn) {
    Object.assign(this, {
      maxHealth: maxHealth,
      health: maxHealth,
      attack: attack,
      name: name,
      nameColor: nameColor,
      inHand: inHand,
      deck: deck,
      manaCost: manaCost,
      manaManager: deck.manaManager,
      manaPerTurn: manaPerTurn,
      hand: hand,
      decks: [playerDeck, enemyDeck],
      selected: false,
      locked: false,
      used: false,
      activeEffects: {}
    });
  };
  copy() {
    return Object.setPrototypeOf(Object.assign({}, this), this.__proto__);
  };
  get indexInDecks() {
    return this.decks.indexOf(this.deck);
  };
  get isDecksTurn() {
    // true means it is... and false means it is not.
    return (turnManager.turnNumber % 2 === this.decks.indexOf(this.deck));
  }
  get isLand() {
    return this instanceof Land;
  }
  get isPrimal() {
    return this instanceof Primal;
  }
  onclick() {
    if (!this.used) {
      if (this.isDecksTurn) {
        if (this.manaManager.mana >= (this.manaCost === "N/A" ? 0 : this.manaCost) && !this.isLand) {
          if (this.isPrimal) {
            enemyWins();
          } else if (!this.selected) {
            this.toggleSelected()
            this.deck.Lockdown(this);
            this.deck.enableEnemyDeck();
            this.deck.selectedCardID = this.ID;
          } else if (this.selected) {
            this.toggleSelected();
            this.deck.OpenUp();
            this.deck.disableEnemyDeck();
            this.deck.selectedCardID = -1;
          };
        };
      } else if (!this.isDecksTurn && this.deck.enemyDeck.selectedCardID + 1) {
        this.deck.selectedCardID = this.ID;
        this.deck.attack();
        this.deck.enemyDeck.OpenUp();
      };
    };
  };
  propogate(card) {
    Object.assign(this, card);
    Object.setPrototypeOf(this, card.__proto__)
  }
  summon() {
    if (this.summonCost <= this.manaManager.mana && turnManager.turnNumber % 2 === this.decks.indexOf(this.deck)) {
      if (confirm('Are you sure you want to summon this card?')) {
        this.hand.manaManager.mana -= this.summonCost === "N/A" ? 0 : this.summonCost;
        Object.assign(this, {
          inHand: false,
          used: true // summoning sickness
        });
        this.deck.addCards(this.copy());
        this.hand.removeCards(this);
      };
    };
  };
  toggleSelected() {
    Object.assign(this, {
      selected: !this.selected
    });
  };
  get style() {
    return `width: ${Math.floor(this.health / this.maxHealth * 100)}; background-color: ${this.barColor};`;
  };
  get barColor() {
    var r = 255 - (this.health / this.maxHealth) * 255;
    var g = (this.health / this.maxHealth) * 255;
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, 0)`;
  };
  get id() {
    return this.ID;
  };
};
class BlankCard extends Card {
  constructor() {
    super(null,null,null,null,null,null,null,{manaManager:null},null,null)
  }
}
class ManaManager {
  constructor(deck) {
    this.mana = 0;
    this.deck = deck;
  };
  get maxMana() {
    return 20 + this.deck.ArrayOfCards.map((i) => (i instanceof Land ? i.manaPerTurn : 0)).reduce((totalManaPerTurn, cardManaPerTurn) => {
      return totalManaPerTurn + cardManaPerTurn;
    });
  };
  get manaBarWidth() {
    return Math.floor(this.mana / this.maxMana * 100);
  };
  get manaPerTurn() {
    var result = this.deck.ArrayOfCards.reduce((accumulator, card) => {
      return accumulator + (card.manaPerTurn === "N/A" ? 0 : card.manaPerTurn);
    }, 0);
    return result;
  };
  set manaGain(mana) {
    this.mana += mana;
    if (this.mana > this.maxMana) {
      this.mana = this.maxMana;
    };
  };
};
class Primal extends Card {
  constructor(hand, deck, name) {
    super(null, "N/A", "#DD00DD", 30, name, true, hand, deck, "N/A");
    this.summonCost = 0;
  };
};
class Land extends Card {
  constructor(manaPerTurn, name, nameColor, inHand, hand, deck) {
    super(null, "N/A", nameColor, "N/A", name, deck.isHand, hand, deck, manaPerTurn);
    this.summonCost = 0;
  };
};