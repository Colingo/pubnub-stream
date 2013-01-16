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

testConnections(2)
testConnections(10)
testConnections(50)

function testConnections(n) {
    var id = uuid()

    test("can subscribe to " + n + " channels", function (assert) {
        var client = connect()
        var done = after(n, function () { assert.end() })

        for (var i = 0; i < n; i++) {
            throughput(duplex(client, channel + id + i), assert, done)
        }
    })
}
