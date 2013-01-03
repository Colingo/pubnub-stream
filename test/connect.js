var extend = require("xtend")
var PUBNUB = require("pubnub-browserify")

module.exports = connect

function connect(options) {
    return PUBNUB.init(extend({}, {
        "subscribe_key": "sub-c-3c5b6d70-5380-11e2-891b-12313f022c90"
        , "publish_key": "pub-c-4b8c3ece-9fb5-4e22-b637-f272a52a0892"
    }, options || {}))
}
