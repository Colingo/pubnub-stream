var ReadStream = require("read-stream")

module.exports = history

function history(client, channel, limit) {
    throw new Error("not implemented / tested")

    var queue = ReadStream()

    client.history({
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
