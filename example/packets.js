var pubnub = require("..")({
        "publish_key": "INSERT"
        , "subscribe_key": "INSERT"
    })
    , publish = pubnub.createWriteStream
    , subscribe = pubnub.createReadStream
    , WriteStream = require("write-stream")
    , assert = require("assert")

    , channel = "TEST:pubnub-stream:packets"
    , count = 0

loop()

function loop() {
    program(500, ++count, function (err) {
        if (err) {
            console.error("throwing", err)
            throw err
        }

        process.exit(0)
    })
}

function program(number, id, callback) {
    console.log("program", id)

    var subscribed = subscribe(channel)
        , published = publish(channel)
        , ended = false
        , got = {

        }

    subscribed
        .pipe(WriteStream(function (data) {
            var count = data.count

            // console.log("got", id, data.id, data.count)

            assert.equal(got[count], undefined)

            got[count] = true

            // console.log("count", Object.keys(got).length)
            if (Object.keys(got).length === number) {
                end()
            }
        }))

    function end() {
        subscribed.close()
        clearTimeout(timer)

        if (ended === false) {
            callback(null)
        } else {
            callback(new Error("did not close"))
        }

        ended = true
    }

    setTimeout(function () {
        console.log("got", got)
    }, (100 * number) + 5000)

    setTimeout(function () {
        console.log("sending", id)
        var count = 1
        loop()

        function loop() {
            published.write({ id: id, count: count })

            count++
            if (count <= number) {
                setTimeout(loop, 100)
            }
        }
    }, 300)

    var timer = setTimeout(function () {
        console.log("no data was published. Probably a race condition")
        callback(new Error("race condition"))
    }, 320000)
}
