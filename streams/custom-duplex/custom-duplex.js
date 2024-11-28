const { Duplex } = require('stream');
const fs = require('fs');

class DuplexStream extends Duplex {
    constructor({
        writableHighWaterMark,
        readableHighWaterMark,
        readFileName,
        writeFileName
    }) {
        super({ readableHighWaterMark, writableHighWaterMark });
        this.readFileName = readFileName;
        this.writeFileName = writeFileName;
        this.readFd = null;
        this.writeFd = null;
        this.chunks = [];
        this.chunksSize = 0;
    }

    _construct(callback) {
        // Nesse código abaixo seria bom usar promises
        // Readable
        fs.open(this.readFileName, 'r', (err, readFd) => {
            if (err) return callback(err);
            this.readFd = readFd;

            // Writable
            fs.open(this.writeFileName, 'w', (err, writeFd) => {
                if (err) return callback(err);
                this.writeFd = writeFd;
                callback()
            })
        })
    }


    _write(chunk, encoding, callback) {
        // Do writing

        // Salvar o chunk na lista e quando atingir o highMarkValue,
        // esvaziar a variavel chunks e escrever tudo no recurso, nesse caso, no arquivo.
        this.chunks.push(chunk)
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
                // Se tiver erro, retorne o callback com argumento, identificando um erro
                if (err) {
                    return callback(err)
                }
                this.chunks = [];
                this.chunksSize = 0;
                callback()
            })
        } else {
            // When we're done, call the callback function
            callback()
        }
    }


    _read(size) {
        const buff = Buffer.alloc(size);
        console.log(`reading ${size}`)
        fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
            if (err) return this.destroy(err) // Como não recebe um callback, destrói a stream
            this.push( // Emite o evento 'data'
                bytesRead > 0
                    ? buff.subarray(0, bytesRead) // Cortar o buffer para ter o tamanho certo. A função subarray corta. Ex: <Buffer 61 73 64>.subarray(0, 1) => <Buffer 61>
                    : null // Null é para indicar o fim do stream, chamando o evento .on('end')
            )
        })
    }


    _final(callback) {
        fs.write(this.writeFd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                return callback(err);
            }
            this.chunks = []
            this.chunksSize = 0;
            // Se não chamar esse callback, não vai chamar o evento 'finish'.
            // O mesmo para os casos acima, o callback é para continuar também.
            callback()
        })
    }


    _destroy(error, callback) {
        callback(error);
    }

}


const duplex = new DuplexStream({ readFileName: 'src.txt', writeFileName: 'dest.txt' })

duplex.write(Buffer.from('teste'))
duplex.write(Buffer.from('teste'))
duplex.write(Buffer.from('teste'))
duplex.write(Buffer.from('teste'))
duplex.end(Buffer.from('testefim'))


duplex.on('data', (chunk) => {
    console.log('chunk:', chunk.toString('utf-8'))
})