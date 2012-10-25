var pubnub = require("..")({
        "publish_key": "INSERT"
        , "subscribe_key": "INSERT"
    })
    , publish = pubnub.createWriteStream
    , subscribe = pubnub.createReadStream
    , WriteStream = require("write-stream")
    , assert = require("assert")

    , channel = "TEST:pubnub-stream:timeout"
    , count = 0

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

    var subscribed = subscribe(channel)
        , published = publish(channel)
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
        console.log("sending devil".blue)
        published.write({ id: id, count: 666 })
    }, 10000)

    timer = setTimeout(function () {
        console.log("no data was published. Probably a race condition")
        callback(new Error("race condition"))
    }, 320000)
}
