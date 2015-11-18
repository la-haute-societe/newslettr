var thru = require('through2').obj;

module.exports = function (callback) {
  var stream = thru(function (obj) { 
    if (obj) {
      this.push(obj);
      callback(obj);
    }
  });
  return stream
}

