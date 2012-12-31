var ReadStream = require("read-stream")

module.exports = subscribe

function subscribe(client, channel, options) {
    var queue = ReadStream()
    var stream = queue.stream

    options = options || {}

    client.subscribe({
        channel: channel
        , restore: options.restore || true
        , connect: options.connect
        , disconnect: options.disconnect
        , reconnect: options.reconnect
        , callback: queue.push
        , error: function (info) {
            var message = info[1] || "pubsub subscribe failed"
            stream.emit("error", Error(message))
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
