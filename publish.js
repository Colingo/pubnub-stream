var WriteStream = require("write-stream")

module.exports = publish

function publish(client, channel) {
    var stream = WriteStream(write)

    return stream

    function write(item) {
        console.log("publishing", item)
        client.publish({
            channel: channel
            , message: item
            , callback: handleError
        })
    }

    function handleError(info) {
        if (info[0] !== 0) {
            return
        }

        var message = info[1] || "pubsub publish failed"
        stream.emit("error", Error(message))
    }
}
