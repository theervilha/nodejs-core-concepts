const { Writable } = require('node:stream');
const fs = require('fs');

class FileWriteStream extends Writable {
    constructor({ highWaterMark, fileName }) {
        super({ highWaterMark });

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }

    _construct(callback) {
        // Essa função vai ser chamada após terminar o constructor() 
        // e vai parar todos os outros métodos, até chamarmos a função callback()
        // Útil para carregar alguma informação importante antes, como um arquivo.

        fs.open(this.fileName, 'w', (err, fd) => {
            // Se der erro lendo o arquivo, chama o callback com um parâmetro, significando erro, e a stream vai parar.
            if (err) {
                callback(err);
            } else {
                // callback sem argumentos significa sucesso
                this.fd = fd
                callback()
            }
        })


    }

    _write(chunk, encoding, callback) {
        // Do writing

        // Salvar o chunk na lista e quando atingir o highMarkValue,
        // esvaziar a variavel chunks e escrever tudo no recurso, nesse caso, no arquivo.
        this.chunks.push(chunk)
        this.chunksSize += chunk.length;

        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                // Se tiver erro, retorne o callback com argumento, identificando um erro
                if (err) {
                    return callback(err)
                }
                this.chunks = [];
                this.chunksSize = 0;
                ++this.writesCount;
                callback()
            })
        } else {
            // When we're done, call the callback function
            callback()
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) {
                return callback(err);
            }
            this.chunks = []
            this.chunksSize = 0;
            ++this.writesCount;
            // Se não chamar esse callback, não vai chamar o evento 'finish'.
            // O mesmo para os casos acima, o callback é para continuar também.
            callback()
        })
    }

    _destroy(error, callback) {
        console.log(`You made ${this.writesCount} writes`)
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            })
        } else {
            // Se não der erro, vai ser null, sem prpblemas
            callback(error);
        }
    }
}

//stream.write(Buffer.from('this is some string'))
//stream.end(Buffer.from('Our last write.'));

// // Quando chamar o callback() da função _write, irá acionar o evento 'drain'
// stream.on('drain', () => {

// })




console.time('writeMany');

(async () => {
    const stream = new FileWriteStream({
        //highWaterMark: 1800,
        fileName: 'writeMany.txt'
    })

    let i = 0;
    const numberOfWrites = 1000000;

    const writeMany = () => {
        while (i < numberOfWrites) {
            const buff = Buffer.from(`${i}\n`, 'utf-8')

            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            i++
            if (!stream.write(buff)) break;
        }
    }

    writeMany();
    stream.on("drain", () => {
        writeMany();
    })


    stream.on("finish", () => {
        console.timeEnd("writeMany");
        console.log('Stream was finished.')
    });

})()