/* Os seguintes termos são diferentes um do outro: */
// encryption / decryption
// compression  
// hashing-salting
// encoding / decoding


/* Encryption / decryption */
// "this is some text" <=> 8ahrt734y57a4951384adfso
// Suggested lib: crypto

/* Compression */
// compress the data to reduce the number of bits. Ex: 0 1 1 1 1 1 1 1 1 => 101
// Good when sending and receiving data
// Suggested lib: z-lib

/* hashing-salting */
// Transforma um valor em algo estranho e não dá para retornar.
// O que pode fazer é receber um novo input e ver se o hash desse novo input é igual ao input anterior.
// Ex: Senha
// Suggested lib: crypto

/* Encoding / decoding */
// 0 1 0 1 1 0 ==> converter para algo entendível. Ex: Converter para texto, imagem, video
// 0 1 01001 010 ==> vira "t"
// Suggested lib: buffer text-encoding/decoding


const { Transform } = require('stream')
const fs = require('fs/promises')

class Encrypt extends Transform {
    constructor(readFileSize, options) {
        super(options)
        this.readFileSize = readFileSize
        this.bytesEncrypted = 0
    }

    _transform(chunk, encoding, callback) {
        for (let i = 0; i < chunk.length; ++i) {
            if (chunk[i] != 255) {
                chunk[i] += 1
            }
        }

        this.bytesEncrypted += chunk.length
        const pct_is_done = (this.bytesEncrypted / this.readFileSize) * 100
        console.log(`Encrypting... ${Math.round(pct_is_done, 2)}%`)

        this.push(chunk)
        callback()
    }
}


(async () => {
    const readFileHandle = await fs.open('read.txt', 'r');
    const writeFileHandle = await fs.open('encripted.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const readFileSize = (await readFileHandle.stat()).size
    console.log('fileSize:', readFileSize, 'bytes')

    const encrypt = new Encrypt(readFileSize);

    // Tudo que for lido em read.txt
    // Vai ser passado no Encrypt (Transform Stream)
    // O dado encriptado vai ser escrito pelo writeStream
    readStream
        .pipe(encrypt)
        .pipe(writeStream)
})()

