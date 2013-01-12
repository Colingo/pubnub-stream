var test = require("tape")
var uuid = require("node-uuid")
var after = require("after")

var connect = require("./util/connect")
var throughput = require("./util/throughput")

var duplex = require("../duplex")

var channel = "pubnub stream test duplex" + uuid()

test("can subscribe to channel", function (assert) {
    var client = connect()
    var stream = duplex(client, channel)

    assert.ok(stream)

    throughput(stream, assert, function () {
        assert.end()
    })
})

test("can subscribe to two channels", function (assert) {
    var client = connect()
    var done = after(2, function () { assert.end() })

    throughput(duplex(client, channel + "1"), assert, done)
    throughput(duplex(client, channel + "2"), assert, done)
})

test("can subscribe to 10 channels", function (assert) {
    var client = connect()
    var done = after(10, function () { assert.end() })

    for (var i = 3; i < 13; i++) {
        throughput(duplex(client, channel + i), assert, done)
    }
})
