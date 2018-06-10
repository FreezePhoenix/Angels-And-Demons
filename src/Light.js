class PlayerUnit extends Card {
  constructor(summonCost, maxHealth, attack, nameColor, name, manaCost, hand=playerHand, deck=playerDeck, manaPerTurn="N/A",manaManager=playerManaManager, inHand=false){
    super(maxHealth, attack, nameColor, manaCost, name, inHand, hand, deck, manaPerTurn);
    this.summonCost = summonCost || 0
  }
}
class EternalFlame extends Primal {
  constructor() {
    super(playerHand, playerDeck, "Eternal Flame")
  }
}
class Angel extends PlayerUnit {
  constructor(hand, deck) {
    super(10, 100, 10, "#DFB720", "Angel", 7, hand, deck);
  }
}
class Paladin extends PlayerUnit {
  constructor(hand, deck) {
    super(5, 60, 5, "#C0C0C0", "Paladin", 4, hand, deck);
  }
}
class Priest extends PlayerUnit {
  constructor(hand, deck) {
    super(5, 20, 5, "#DF5F30", "Priest", 3, hand, deck)
  }
}