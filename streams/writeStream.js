// Writing something so many times in a file
const fs = require('fs/promises');

console.time('writeMany');

(async () => {
    const file = await fs.open('test.txt', 'w');

    stream = file.createWriteStream();

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
        file.close();
    });
})()
