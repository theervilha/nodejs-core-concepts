// Server will receive the data of the file of the client
// Treat data and return to the client

const net = require('net')
const fs = require('fs/promises');

const server = net.createServer(() => { })

let fileHandle;

server.on('connection', (socket) => {
    // Socket refers to the client endpoint
    console.log('New connection!')

    socket.on('data', async (data) => {
        console.log('buffer received from client:', data);
        fileHandle = await fs.open(`storage/test.txt`, 'w');
        const fileStream = fileHandle.createWriteStream();

        // Writing to our destination file
        fileStream.write(data);
    })

    socket.on('end', () => {
        fileHandle.close();
        console.log('Uploaded ended')
    })
})

server.listen(5050, "::1", () => {
    console.log('Uploader server opened on', server.address())
})