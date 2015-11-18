# nothread
> (Attempt to) Prevent email threading in mail applications

## Abstract

We test lots of email templates, and threading in email clients makes reviewing changes 
over many iterations annoying.

This module attempts to prevent threading in most email clients, by modifying the subject and `In-Reply-To` header with a unique ID.

nothread supports msgs with both text and object-based headers. Ex:
```js
{
  headers: "foo: bar\n baz: biz"
}
```

```js
{
  headers: {
    foo: 'bar',
    baz: 'biz'
  }
}
```

## Installation
`npm install nothread --save`

## Usage

```js
var nothread = require('nothread');

var myMailMsg = {
  to: "email@foo.biz",
  subject: "bar baz",
  body: "some template"
};

mail.send(nothread(myMailMsg));

```

## Tests

```
> npm test

TAP version 13

# object headers
ok 1 (unnamed assert)
ok 2 (unnamed assert)

# text headers
ok 3 (unnamed assert)
ok 4 (unnamed assert)

1..4
# tests 4
# pass  4

# ok
```
