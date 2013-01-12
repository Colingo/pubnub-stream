var WriteStream = require("write-stream")

module.exports = throughput

function throughput(stream, assert, done) {
    var list = []
    var count = 0

    stream.once("connect", function () {
        stream.write("one")
        stream.write("two")
        stream.write("three")
        stream.end()
    })

    stream.pipe(WriteStream(function (chunk) {
        count++
        list.push(chunk)

        if (count === 3) {
            assert.deepEqual(list, ["one", "two", "three"])
            stream.close()
            done()
        }
    }))
}
