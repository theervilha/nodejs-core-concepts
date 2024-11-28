// Grab a file
// Send the file to the server
const net = require('net');
const fs = require('fs/promises');

const socket = net.createConnection({ 'host': '::1', port: 5050 }, async () => {
    const filePath = 'text.txt';
    const fileHandle = await fs.open(filePath, "r");
    const fileStream = fileHandle.createReadStream();

    // Reading from source file and sending to server
    fileStream.on('data', (data) => {
        socket.write(data)
    })

    fileStream.on('end', async () => {
        console.log('finished')
        fileHandle.close()
        socket.end()
    })
})



