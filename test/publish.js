var test = require("tape")
var uuid = require("node-uuid")
var WriteStream = require("write-stream")

var connect = require("./util/connect")

var subscribe = require("../subscribe")
var publish = require("../publish")

var channel = "pubnub stream test publish" + uuid()

test("can publish to channel", function (assert) {
    var client = connect()
    var read = subscribe(client, channel)

    read.once("connect", function () {
        var write = publish(client, channel)

        write.write("one")
        write.end()
    })

    read.pipe(WriteStream(function write(message) {
        assert.equal(message, "one")
        read.close()

        assert.end()
    }))
})

test("can publish multiple messages", function (assert) {
    var client = connect()
    var read = subscribe(client, channel)
    var messages = ["one", "two", "three"]
    var list = []

    read.once("connect", function () {
        var write = publish(client, channel)

        messages.forEach(function (msg) {
            write.write(msg)
        })
        write.end()
    })

    read.pipe(WriteStream(function write(message) {
        list.push(message)

        if (list.length === messages.length) {
            finish()
        }
    }))

    function finish() {
        assert.deepEqual(list, messages)

        read.close()

        assert.end()
    }
})

test("can send really large message", function (assert) {
    var message = largeMessage(1800)
    var client = connect()
    var read = subscribe(client, channel)

    read.on("connect", function () {
        var write = publish(client, channel)

        write.write(message)
        write.end()
    })

    read.pipe(WriteStream(function write(chunk) {
        assert.equal(message, chunk)

        read.close()
        assert.end()
    }))
})

function largeMessage(n) {
    var res = ""
    var cur = 0

    for (var i = 0; i < n; i++) {
        res += cur

        cur++

        if (cur === 10) {
            cur = 0
        }
    }

    return res
}
