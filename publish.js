var WriteStream = require("write-stream")

module.exports = publish

function publish(client, channel) {
    var push = Queue(sendItem)
        , stream = WriteStream(push)

    return stream

    function sendItem(item, callback) {
        client.publish({
            channel: channel
            , message: item
            , callback: handleError
        })

        function handleError(info) {
            if (info[0] === 0) {
                var message = info[1] || "pubsub publish failed"
                stream.emit("error", Error(message))
            }

            callback()
        }
    }
}

function Queue(action) {
    var buffer = []

    return push

    function push(data) {
        buffer.push(data)
        if (buffer.length === 1) {
            action(buffer[0], next)
        }
    }

    function next() {
        buffer.shift()
        if (buffer.length > 0) {
            action(buffer[0], next)
        }
    }
}
