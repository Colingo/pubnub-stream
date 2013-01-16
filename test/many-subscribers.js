var test = require("tape")
var uuid = require("node-uuid")
var after = require("after")

var connect = require("./util/connect")

var publish = require("../publish")
var subscribe = require("../subscribe")

var channel = "pubnub stream test many subscribers" + uuid()

test.only("50 concurrent subcriptions to the same channel", function (assert) {
    var writable = publish(connect(), channel)
    var list = range(50)
    var next = after(50, publishMessages)
    var done = after(50, function () { assert.end() })

    var streams = list.
        map(function (i) { return subscribe(connect(), channel) }).
        forEach(function (stream, i) {
            var chunks = ["one", "two", "three"]
            stream.once("connect", function () {
                // console.log("connected", i)
                next()
            })

            stream.on("data", function (chunk) {
                // console.log("got chunk", chunk, i)
                assert.equal(chunk, chunks.shift())

                if (chunks.length === 0) {
                    stream.close()
                }
            })

            stream.on("end", function () {
                // console.log("END", i)
                done()
            })
        })

    function publishMessages() {
        // console.log("publishingMessages")

        writable.write("one")
        writable.write("two")
        writable.write("three")
        writable.end()
    }
})

function range(start, end) {
    if (end === undefined) {
        end = start
        start = 0
    }

    var list = []

    for (var i = start; i < end; i++) {
        list.push(i)
    }

    return list
}
