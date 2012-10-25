var ReadStream = require("read-stream")
    , WriteStream = require("write-stream")

module.exports = pubnub

function pubnub(PubNub) {
    return {
        createReadStream: createReadStream
        , createWriteStream: createWriteStream
        , createHistoryStream: createHistoryStream
    }

    function createReadStream(channel, options) {
        var queue = ReadStream()
            , stream = queue.stream
            , client = PubNub()

        options = options || {}

        client.subscribe({
            channel: channel
            , restore: options.restore || true
            , connect: options.connect
            , disconnect: options.disconnect
            , reconnect: options.reconnect
            , callback: function (chunk) {
                // console.log("got chunk", chunk)

                queue.push(chunk)
            }
            , error: function (info) {
                stream.emit("error"
                    , new Error(info[1] || "pubsub subscribe failed"))
            }
        })

        stream.close = close

        return stream

        function close() {
            client.unsubscribe({
                channel: channel
            })

            queue.end()
        }
    }

    function createWriteStream(channel) {
        var stream = WriteStream(write)

        return stream

        function write(item) {
            // console.log("writing item", item)
            PubNub().publish({
                channel: channel
                , message: item
                , callback: function (ev) {
                    // console.log("published", ev)

                    handleError(ev)
                }
            })
        }

        function handleError(info) {
            if (info[0] === 0) {
                console.error("error".red, info)
                stream.emit("error"
                    , new Error(info[1] || "pubsub publish failed"))
            }
        }
    }

    function createHistoryStream(channel, limit) {
        var queue = ReadStream()

        PubNub().history({
            limit: limit
            , channel: channel
            , callback: returnResults
        })

        return queue.stream

        function returnResults(res) {
            res.forEach(queue.push)
            queue.end()
        }
    }
}
