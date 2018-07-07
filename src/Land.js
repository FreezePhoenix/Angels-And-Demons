class Stone extends Land {
  constructor(hand, deck, name) {
    super(1, name, '#B0C4DE', deck.isHand, hand, deck);
  };
};
function newMountain(hand=playerHand, deck=playerDeck) {
    return new Stone(hand, deck, "Mountain");
};
function newRavine(hand=enemyHand, deck=enemyDeck) {
    return new Stone(hand, deck, "Ravine");
};