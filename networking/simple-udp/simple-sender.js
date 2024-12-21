const { error } = require('console');
const dgram = require('dgram');

const sender = dgram.createSocket('udp4');

sender.send('This is a string', 8000, '127.0.0.1', (error, bytes) => {
    if (error) console.error(error)
    console.log(bytes)
})