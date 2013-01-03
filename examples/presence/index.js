var PUBNUB = require("pubnub-browserify")
var assert = require("assert")
var uuid = require("node-uuid")

var presence = require("../../presence")
var subscribe = require("../../subscribe")

var id = uuid()
var client = PUBNUB.init({
    "subscribe_key": "sub-c-3c5b6d70-5380-11e2-891b-12313f022c90"
    , "publish_key": "pub-c-4b8c3ece-9fb5-4e22-b637-f272a52a0892"
    , "uuid": id
})

var channel = "pubnubstreamexamplespresence"

var people = presence(client, channel)

people.once("connect", function () {
    console.log("lol never connect")
    var subscription = subscribe(client, channel)
})

people.on("update", function () {
    console.log("UPDATED", arguments)
})

people.set(id, {
    name: "bob"
})
