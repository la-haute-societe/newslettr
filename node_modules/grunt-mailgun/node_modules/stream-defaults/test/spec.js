var def    = require('../'),
    thru   = require('through2').obj,
    expect = require('chai').expect;

var mock     = { foo: 'bar', one: true, two: false },
    defaults = { biz: 'baz', one: false, three: true },
    expected = { biz: 'baz', one: true, three: true, foo: 'bar', two: false }

function helper (data) {
  var stream = thru(function(chunk){this.push(chunk)},function(cb){cb()});
  stream.write(data);
  return stream
}


function test (callback) {
  var stream = thru(function(chunk){callback(chunk)},function(cb){cb()});
  return stream
}

describe('default-stream', function () {

  it('applies defaults', function (done) {
   helper(mock).pipe(def(defaults)).pipe(test(function (result) {
   expect(result).to.deep.equal(expected);
   done();
   }));
  });

});



