class EnemyUnit extends Card {
   constructor(summonCost, maxHealth, attack, nameColor, name, manaCost, hand=enemyHand, deck=enemyDeck, manaPerTurn="N/A", manaManager=enemyManaManager, inHand=false) {
     super(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn);
     this.summonCost = summonCost || 0
  };
};
class Demon extends EnemyUnit {
  constructor(hand, deck) {
    super(10, 100, 10, "#DFB720", "Demon", 7, hand, deck);
  };
};
class HellHound extends EnemyUnit {
  constructor(hand, deck) {
    super(5, 60, 5, "#C0C0C0", "Hell Hound", 4, hand, deck);
  };
};
class Cuthulu extends Primal {
  constructor() {
    super(enemyHand, enemyDeck, "Cuthulu");
  };
};
class ThornKnight extends EnemyUnit {
  constructor(hand, deck) {
    super(5, 20, 5, "#DF5F30", "Thorn Knight", 3, hand, deck);
  };
};