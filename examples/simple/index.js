var WriteStream = require("write-stream")
var PUBNUB = require("pubnub-browserify")
var assert = require("assert")

var publish = require("../../publish")
var subscribe = require("../../subscribe")

var client = PUBNUB.init({
    "subscribe_key": "sub-c-3c5b6d70-5380-11e2-891b-12313f022c90"
    , "publish_key": "pub-c-4b8c3ece-9fb5-4e22-b637-f272a52a0892"
})
var channel = "pubnub-streamexamplessimple"
var list = window.list = []
var count = 0

var readStream = subscribe(client, channel)
var writeStream = publish(client, channel)

readStream.pipe(WriteStream(function (chunk) {
    count++
    if (count === 4) {
        readStream.close()
        console.log("list", list)
        assert.deepEqual(list, ["one", "two", "three"])
    } else {
        list.push(chunk)
    }
}))

writeStream.write("one")
writeStream.write("two")
writeStream.write("three")
writeStream.write("EOF")

