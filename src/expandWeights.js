function expandWeights(weights) {
  let result = [];
  weights.forEach( (item) => {
    let weightedItem = item[0];
    for(var i = 0; i < item[1]; i++) {
      result.push(weightedItem);
    };
  });
  return result;
};