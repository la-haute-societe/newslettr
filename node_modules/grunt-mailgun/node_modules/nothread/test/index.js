var test     = require('tape'),
    nothread = require('../');

test('object headers', function (t) {
  t.plan(2);
 
  var msg    = { headers: { foo: "bar" }, subject: "some subject" },
      result = nothread(msg);

  t.ok(result.subject.match(/^some subject \- [a-f0-9]{20}$/));
  t.ok(result.headers['In-Reply-To'].match(/^<[a-f0-9]{20}>$/));
});

test('text headers', function (t) {
  t.plan(2);

  var msg    = { headers: "foo: bar", subject: "some subject" },
      result = nothread(msg);

  t.ok(result.subject.match(/^some subject \- [a-f0-9]{20}$/));
  t.ok(result.headers.match(/foo: bar\nIn-Reply-To: <[a-f0-9]{20}>/));
});
