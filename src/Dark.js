class EnemyUnit extends Card {
   constructor(summonCost, maxHealth, attack, nameColor, name, manaCost, hand=enemyHand, deck=enemyDeck, manaPerTurn="N/A", manaManager=enemyManaManager, inHand=false) {
     super(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn);
     this.summonCost = summonCost || 0
  };
};
function newDemon (hand, deck) {
    return new EnemyUnit(10, 100, 10, "#DFB720", "Demon", 7, hand, deck);
};
function newHellHound (hand, deck) {
    return new EnemyUnit(5, 60, 5, "#C0C0C0", "Hell Hound", 4, hand, deck);
};
function newCuthulu() {
    return new Primal(enemyHand, enemyDeck, "Cuthulu");
};
function newThornKnight(hand, deck) {
    return new EnemyUnit(5, 20, 5, "#DF5F30", "Thorn Knight", 3, hand, deck);
};