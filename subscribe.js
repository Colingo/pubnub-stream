var ReadStream = require("read-stream")
var channels = ["void"]
var streams = {
    "void": []
}

module.exports = subscribe

function subscribe(client, channel, options) {
    var queue = ReadStream()
    var stream = queue.stream
    var hash = {}

    options = options || {}

    client.subscribe({
        channel: channel
        , restore: options.restore || true
        , connect: function () {
            stream.emit("connect")

            options.connect && options.connect()
        }
        , disconnect: function () {
            stream.emit("disconnect")

            options.disconnect && options.connect()
        }
        , reconnect: function () {
            stream.emit("reconnect")

            options.reconnect && options.reconnect()
        }
        , callback: function (msg) {
            var parts = msg.split("\n")
            var header = parts[0]
            var payload = parts[1]

            if (header.length === 0) {
                return queue.push(JSON.parse(payload))
            }

            var headerParts = header.split(":")
            var id = headerParts[0]
            var list = hash[id] || (hash[id] = [])
            var length = +headerParts[1] || list[0]

            if (list.length === 0) {
                list[0] = length
            }

            list.push(payload)

            if (list.length !== length + 1) {
                return
            }

            var message = list.slice(1).join("")

            queue.push(JSON.parse(message))
        }
        , error: function () {
            stream.emit("error", Error("pubsub subscribe failed"))
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
