var test = require("tape")
var uuid = require("node-uuid")
// var after = require("after")

var connect = require("./connect")

var publish = require("../publish")
var history = require("../history")

var channel = "pubnubstreamtesthistory" + uuid()

// not tested yet
test("can read from history", function (assert) {
    var client = connect()
    var stream = publish(client, channel)

    assert.ok(stream)

    stream.write("one")
    stream.write("two")
    stream.write("three")
    stream.end()

    assert.end()
})
