class Stone extends Land {
  constructor(hand, deck, name) {
    super(1, name, '#B0C4DE', deck.isHand, hand, deck);
  }
};
class Mountain extends Stone {
  constructor(hand=playerHand, deck=playerDeck){
    super(hand, deck, "Mountain");
  }
};
class Ravine extends Stone {
  constructor(hand, deck){
    super(hand, deck, "Ravine");
  }
};