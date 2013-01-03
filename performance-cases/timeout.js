var PUBNUB = require("pubnub")
var WriteStream = require("write-stream")
var assert = require("assert")
var setTimeout = require("timers").setTimeout
var clearTimeout = require("timers").clearTimeout

var publish = require("../publish")
var subscribe = require("../subscribe")

var client = PUBNUB.init({
    "subscribe_key": "sub-c-3c5b6d70-5380-11e2-891b-12313f022c90"
    , "publish_key": "pub-c-4b8c3ece-9fb5-4e22-b637-f272a52a0892"
})
var channel = "TEST:pubnub-stream:timeout"
var count = 0

loop()

function loop() {
    program(++count, function (err) {
        if (err) {
            console.error("throwing", err)
            throw err
        }

        setTimeout(loop, 3000)
    })
}

function program(id, callback) {
    console.log("program", id)

    var subscribed = subscribe(client, channel)
        , published = publish(client, channel)
        , ended = false
        , got = {
            1: false
            , 2: false
            , 3: false
            , 666: false
        }
        , timer
        , devil

    subscribed
        .pipe(WriteStream(function (data) {
            var count = data.count

            console.log("got", id, data.id, data.count, ended)

            assert.equal(got[count], false)

            got[count] = true

            if (got["1"] && got["2"] && got["3"]) {
                end()
            }
        }))

    function end() {
        subscribed.close()
        clearTimeout(timer)
        clearTimeout(devil)

        if (ended === false) {
            callback(null)
        } else {
            callback(new Error("did not close"))
        }

        ended = true
    }

    setTimeout(function () {
        console.log("sending", id)
        published.write({ id: id, count: 1 })
    }, 300)

    setTimeout(function () {
        published.write({ id: id, count: 2 })
    }, 600)

    setTimeout(function () {
        published.write({ id: id, count: 3 })
    }, 1000)

    devil = setTimeout(function () {
        console.log("sending devil")
        published.write({ id: id, count: 666 })
    }, 10000)

    timer = setTimeout(function () {
        console.log("no data was published. Probably a race condition")
        callback(new Error("race condition"))
    }, 320000)
}
