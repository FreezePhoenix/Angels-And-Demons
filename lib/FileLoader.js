function loadFile(fileUrl, callBack) {
  var requestURL = fileUrl,
      request = new XMLHttpsRequest();
  request.open('GET', requestURL, true);
  request.responseType = 'json';
  request.send();
  request.onload = function() {
    var data = request.response;
    callBack(data)
  }
}