var reemit = require("re-emitter/reemit")

var publish = require("./publish")
var subscribe = require("./subscribe")

module.exports = duplex

function duplex(client, channel, options) {
    var read = subscribe(client, channel, options)
    var write = publish(client, channel)

    read.write = write.write
    read.end = write.end

    reemit(write, read, ["error", "drain", "finish", "pipe"])

    return read
}
