class Crippler extends Card {
  constructor(hand, deck, name, effects, maxHealth, summonCost) {
    super(maxHealth, "N/A", "#C0C0C0", 9, name, true, hand, deck, "N/A");
    this.summonCost = summonCost || 0;
    this.effects = effects;
  };
};
class DarkAgent extends Crippler {
  constructor(hand=enemyHand, deck=enemyDeck) {
    super(hand, deck, "Dark Agent", {
      manaCost: new Effect(3, 3, "manaCost", 1),
      health: new Effect(-10, 3, "health", -5),
      attack: new Effect(-3, 3, "attack", -5)
    }, 20, 10);
  };
};
class Lamp extends Crippler {
  constructor(hand=enemyHand, deck=enemyDeck) {
    super(hand, deck, "Lamp", {
      manaCost: new Effect(3, 3, "manaCost", 1),
      health: new Effect(-10, 3, "health", -5),
      attack: new Effect(-3, 3, "attack", -5)
    }, 20, 10);
  };
}