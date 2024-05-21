const fs = require('fs/promises');

(async () => {
    const fileHandleRead = await fs.open('src.txt', 'r');
    const fileHandleWrite = await fs.open('dest.txt', 'w');

    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    // Instead read all data in one time, it will separate in chunks
    streamRead.on('data', (chunk) => {
        if (!streamWrite.write(chunk)) {
            streamRead.pause()
        }
        // console.log(chunk.length) // Length of highWaterMark is 65 KiB, not 16kb like a Writable stream
    })

    streamWrite.on('drain', () => {
        streamRead.resume()
    })

})()