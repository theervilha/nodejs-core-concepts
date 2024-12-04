// Server will receive the data of the file of the client
// Treat data and return to the client

const net = require('net')
const fs = require('fs/promises');

const server = net.createServer(() => { })

let fileHandle, fileWriteStream;

server.on('connection', (socket) => {
    // Socket refers to the client endpoint
    console.log('New connection!')

    socket.on('data', async (data) => {
        console.log('buffer received from client:', data);
        if (!fileHandle) {
            // Pause receiving data to wait for the file to be opened
            socket.pause()
            fileHandle = await fs.open(`storage/test.txt`, 'w');
            fileWriteStream = fileHandle.createWriteStream();

            socket.resume()
            fileWriteStream.on('drain', () => {
                socket.resume()
            })
        }

        if (!fileWriteStream.write(data)) {
            console.log('server> stop sending data')
            socket.pause()
        }
    })

    socket.on('end', () => {
        fileHandle.close();
        fileHandle = undefined;
        fileWriteStream = undefined;
        console.log('Uploaded ended')
    })
})

server.listen(5050, "::1", () => {
    console.log('Uploader server opened on', server.address())
})