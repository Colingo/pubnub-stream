var WriteStream = require("write-stream")
var toArray = require("write-stream/array")
var PUBNUB = require("pubnub-browserify")
var assert = require("assert")
var uuid = require("node-uuid")
var setTimeout = require("timers").setTimeout

var publish = require("../../publish")
var subscribe = require("../../subscribe")
var history = require("../../history")

var client = PUBNUB.init({
    "subscribe_key": "sub-c-3c5b6d70-5380-11e2-891b-12313f022c90"
    , "publish_key": "pub-c-4b8c3ece-9fb5-4e22-b637-f272a52a0892"
})
var channel = "pubnub-streamexamples" + uuid()

var writeStream = publish(client, channel)

writeStream.write("one")
writeStream.write("two")
writeStream.write("three")
writeStream.end()

writeStream.once("finish", function () {
    console.log("finished")

    setTimeout(function () {
        var readStream = history(client, channel)

        readStream.pipe(toArray(function (list) {
            console.log("list", list)
            assert.deepEqual(list, ["one", "two", "three"])
        }))
    }, 1000)
})
