function expandWeights(weights){
  var result = []
  weights.forEach( (item) => {
    var weightedItem = item[0]
    for(var i = 0; i < item[1]; i++){
      result.push(weightedItem)
    }
  })
  return result
}