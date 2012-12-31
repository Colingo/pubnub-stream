var EndStream = require("end-stream")
var Queue = require("push-queue")

module.exports = publish

function publish(client, channel) {
    var push = Queue(sendItem)
    var stream = EndStream(push)

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
