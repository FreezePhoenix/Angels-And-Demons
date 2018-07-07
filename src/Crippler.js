class Crippler extends Card {
  constructor(hand, deck, name, effects, maxHealth, summonCost) {
    super(maxHealth, "N/A", "#C0C0C0", 9, name, true, hand, deck, "N/A");
    this.summonCost = summonCost || 0;
    this.effects = effects;
  };
};
function newDarkAgent(hand=enemyHand, deck=enemyDeck) {
    return new Crippler(hand, deck, "Dark Agent", {
      manaCost: new Effect(3, 3, "manaCost", 1),
      health: new Effect(-10, 3, "health", -5),
      attack: new Effect(-3, 3, "attack", -5)
    }, 20, 10);
};
function newLamp(hand=enemyHand, deck=enemyDeck) {
    return new Crippler(hand, deck, "Lamp", {
      manaCost: new Effect(3, 3, "manaCost", 1),
      health: new Effect(-10, 3, "health", -5),
      attack: new Effect(-3, 3, "attack", -5)
    }, 20, 10);
};