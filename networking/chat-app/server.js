const net = require('net');

const server = net.createServer()

server.listen(3000, '127.0.0.1', () => {
    console.log('Opened server on http://127.0.0.1:3000')
})

let sockets_connected = []

// O socket é o mesmo tipo de um client, então praticamente você pode enviar e receber informações pro cliente
server.on('connection', (socket) => {
    const clientId = sockets_connected.length + 1

    sockets_connected.forEach(client => {
        client.socket.write(`User ${clientId} connected!`)
    })

    socket.write(`id-${clientId}`)
    sockets_connected.push({ clientId, socket })

    socket.on('data', (data) => {
        const data_str = data.toString()
        const id = data_str.substring(0, data_str.indexOf('-'));
        const message = data_str.substring(data_str.indexOf('-') + 9);
        sockets_connected.forEach(client => {
            client.socket.write(`> User ${id}: ${message}`)
        })
    })

    // Handle socket end
    socket.on('end', () => {
        sockets_connected.forEach(client => {
            client.socket.write(`User ${client.clientId} left.`)
        })
    });

    // Dá para fazer tratativas de que, quando estiver dando erro na conexão, como memória cheia, desconectar alguns usuários.
    // Handle socket error
    socket.on('error', (err) => {
        sockets_connected.forEach(client => {
            client.socket.write(`User ${client.clientId} left.`)
        })
    });
})

