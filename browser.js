var PubNubStream = require("./pubnub-stream")
    , PubNub = require("./pubnub")

module.exports = pubnub

function pubnub(options) {
    return PubNubStream(function () {
        return PubNub(options)
    })
}
