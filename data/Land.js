class Stone extends Land {
  constructor(hand, deck, name) {
    super(1, name, 'LightSteelBlue', deck.isHand, hand, deck);
  }
};
class Mountain extends Stone {
  constructor(hand, deck){
    super(hand, deck, "Mountain");
  }
};
class Ravine extends Stone {
  constructor(hand, deck){
    super(hand, deck, "Ravine");
  }
};