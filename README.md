# pubnub-stream

Thin stream abstraction on top of pubnub

## Example

``` js
var pubnub = require("pubnub-stream")({
        publish_key: "pub-key"
        , subscribe_key: "sub-key"
    })
    , publish = pubnub.createWriteStream
    , subscribe = pubnub.createReadStream
    , WriteStream = require("write-stream")

    , subscribed = subscribe(channel)
    , published = publish(channel)

subscribed
    .pipe(WriteStream(function (data) {
        // incoming data from pubnub channel
    }))

published.write({ some: "data" })
```

## Known issues

 - Sometimes you get the same published message multiple times
    in a subscription.

 - Sometimes a subscription does not give you the message you expect.
    (i.e. messages get lost permanently)

 - Sometimes a message gets lost in pubnub until you send another one
    and those two messages come together

 - Almost no sensible error handling

 - Doesn't handle the subscribe timeout at all

 - packets are not ordered


## Installation

`npm install pubnub-stream`

## Contributors

 - Raynos

## MIT Licenced
