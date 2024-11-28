const net = require("net");

const server = net.createServer((socket) => {
    // O Socket é um Duplex Stream, então dá para receber dados e enviar dados.
    socket.on('data', (data) => {
        console.log(data.toString())
    })
})

server.listen(3099, "127.0.0.1", () => {
    console.log('Opened server on', server.address())
})