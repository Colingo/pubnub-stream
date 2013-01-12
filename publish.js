var EndStream = require("end-stream")
var Queue = require("push-queue")
var splitEvery = require("split-every")
var uuid = require("node-uuid")
var after = require("after")

module.exports = publish

function publish(client, channel) {
    var push = Queue(sendItem)
    var stream = EndStream(function write(item, callback) {
        push(JSON.stringify(item), callback)
    })

    return stream

    function sendItem(json, callback) {
        if (json.length > 600) {
            var list = json.split("")
            var id = uuid()
            var chunks = splitEvery(550, list).
                map(function (list) {
                    return list.join("")
                })
            var length = chunks.length
            var enqueue = Queue(function (json, callback) {
                publish(json, function (err) {
                    if (err) {
                        return stream.emit("error", err)
                    }

                    callback()
                })
            })

            var done = after(length, function (err) {
                if (err) {
                    return stream.emit("error", err)
                }

                callback()
            })

            chunks.forEach(function (chunk, index) {
                var head = id + ":"

                if (index === 0) {
                    head += length
                }

                head += "\n"

                var data = head + chunk

                enqueue(data, done)
            })
        } else {
            publish("\n" + json, function (err) {
                if (err) {
                    return stream.emit("error", err)
                }

                callback()
            })
        }
    }

    function publish(payload, callback) {
        client.publish({
            channel: channel
            , message: payload
            , callback: handleError
        })

        function handleError(info) {
            if (info[0] === 0) {
                var message = info[1] || "pubsub publish failed"
                return callback(Error(message))
            }

            callback()
        }
    }
}
