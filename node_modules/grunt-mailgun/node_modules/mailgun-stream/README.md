# mailgun-stream
Streaming module for mailgun



## Install

`npm install mailgun-stream`

## Usage

```JS
var mail     = require('mailgun-stream'),
    defaults = require('stream-defaults');

// Authenticate to mailgun
mail.config({key: 'my-mailgun-api-key'});

// Setup a some defaults
var opts = {
  subject: "A default subject!",
  body: "this is the msg you'll see if a body doesn't already exist"
}

// Grab a msg, apply our defaults, send the mail, and then continue sending the msg down the pipe
fetchMsgFromQueue().pipe(defaults(opts)).pipe(mail.send()).pipe(whatever)


```
