# stream-output
>Get the result of stream output for your tests

There's no way this doesn't already exist, but I can't find what I'm looking for on npm.

I use transform streams for flow control/validation/mutation. I needed a clean way to run assertions on the end result during unit tests.

```JS
var output = require('stream-output/obj');

describe('Testing a set of transforms', function () {
  it('Does some shiz', function (done) {
    var test = function (data) {
      expect(data).to.have.deep.property('foo','bar');
      done();
    }
    SomeObjModeStream.pipe(someTransform).pipe(output(test));
  }
});
```
