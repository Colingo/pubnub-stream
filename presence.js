var ExpiryModel = require("expiry-model")
var WriteStream = require("write-stream")
var reemit = require("re-emitter/reemit")

var subscribe = require("./subscribe")
var duplex = require("./duplex")

var PRESENCE_SUFFIX = "-pnpres"
var EXPIRY_SUFFIX = "-expmodel"

module.exports = presence

function presence(client, channel, options) {
    var model = ExpiryModel(options)

    var presenceStream = subscribe(client, channel + PRESENCE_SUFFIX)
    var modelStream = duplex(client, channel + EXPIRY_SUFFIX)

    client.here_now({
        channel: channel
        , callback: function (here) {
            console.log("CALLBACK", arguments)
            var uuids = here.uuids || []
            uuids.forEach(function (uuid) {
                model.set(uuid, {
                    id: uuid
                })
            })
        }
    })

    presenceStream.pipe(WriteStream(function (chunk) {
        console.log("chunk", chunk)
    }))

    reemit(presenceStream, model, ["connect"])

    modelStream.pipe(model.createStream()).pipe(modelStream)

    return model
}
