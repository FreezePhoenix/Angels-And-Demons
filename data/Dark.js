class EnemyUnit extends Card {
   constructor(summonCost, maxHealth, attack, nameColor, name, manaCost, hand=enemyHand, deck=enemyDeck, manaPerTurn="N/A", manaManager=enemyManaManager, inHand=false){
     super(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn);
     this.summonCost = summonCost
  }
}
class Demon extends EnemyUnit {
  constructor(hand, deck) {
    super(10, 100, 10, "Gold", "Demon", 7, hand, deck);
  }
}
class HellHound extends EnemyUnit {
  constructor(hand, deck) {
    super(5, 60, 5, "Silver", "Hell Hound", 4, hand, deck);
  }
}
/*
class Skeleton extends EnemyUnit {
  constructor(hand, deck) {
    super(3, 30, 5, ")
  }
}
//*/
class Cuthulu extends Primal {
  constructor() {
    super(enemyHand, enemyDeck, "Cuthulu")
  }
}