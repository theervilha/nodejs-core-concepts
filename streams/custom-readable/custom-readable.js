const { Readable } = require('stream');
const fs = require('fs');

class FileReadStream extends Readable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });
        this.fileName = fileName;
        this.fd = null;
    }

    _construct(callback) {
        fs.open(this.fileName, 'r', (err, fd) => {
            if (err) return callback(err);
            this.fd = fd;
            callback()
        })
    }

    _read(size) {
        const buff = Buffer.alloc(size);
        console.log(`reading ${size}`)
        fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err) // Como não recebe um callback, destrói a stream
            this.push( // Emite o evento 'data'
                bytesRead > 0
                    ? buff.subarray(0, bytesRead) // Cortar o buffer para ter o tamanho certo. A função subarray corta. Ex: <Buffer 61 73 64>.subarray(0, 1) => <Buffer 61>
                    : null // Null é para indicar o fim do stream, chamando o evento .on('end')
            )
        })
    }

    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (error) => callback(error || err));
        } else {
            callback(err)
        }
    }
}

const stream = new FileReadStream({ fileName: 'src.txt' })
stream.on('data', (chunk) => {
    console.log(chunk)
})

stream.on('end', () => {
    console.log('Stream is done reading')
})