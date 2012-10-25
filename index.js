var PubNub = require("./pubnub-server")
    , PubNubStream = require("./pubnub-stream")

module.exports = pubnub

function pubnub(options) {
    return PubNubStream(function () {
        return PubNub(options)
    })
}
