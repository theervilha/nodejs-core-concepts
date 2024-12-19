// Grab a file
// Send the file to the server
const net = require('net');
const fs = require('fs/promises');
const path = require('path')

let fileReadStream;

const socket = net.createConnection({ 'host': '::1', port: 5050 }, async () => {
    const fileName = path.basename(process.argv[2]);
    socket.write(`fileName: ${fileName}-->`)

    const fileHandle = await fs.open(fileName, "r");
    fileReadStream = fileHandle.createReadStream();
    const fileSize = (await fileHandle.stat()).size;

    // For showing upload progress
    let uploadedPercentage = 0;
    let bytesUploaded = 0;

    // Reading from source file and sending to server
    fileReadStream.on('data', (data) => {
        if (!socket.write(data)) {
            console.log('stop sending data')
            fileReadStream.pause()
        }
        bytesUploaded += data.length
        let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);
        //console.log(`bytes uploaded: ${bytesUploaded}`)

        if (newPercentage !== uploadedPercentage) {
            uploadedPercentage = newPercentage
            console.log(`Uploading... ${uploadedPercentage}%`)
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

