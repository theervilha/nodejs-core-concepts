// Grab a file
// Send the file to the server
const net = require('net');
const fs = require('fs/promises');

let fileReadStream;

const socket = net.createConnection({ 'host': '::1', port: 5050 }, async () => {
    const filePath = 'text.txt';
    const fileHandle = await fs.open(filePath, "r");
    fileReadStream = fileHandle.createReadStream();

    // Reading from source file and sending to server
    fileReadStream.on('data', (data) => {
        if (!socket.write(data)) {
            console.log('stop sending data')
            fileReadStream.pause()
        }
    })

    socket.on('drain', () => {
        console.log('drained client')
        fileReadStream.resume()
    })

    fileReadStream.on('end', async () => {
        console.log('finished')
        fileHandle.close()
        socket.end()
    })
})

