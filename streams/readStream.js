const fs = require('fs/promises');

(async () => {
    const fileHandleRead = await fs.open('src.txt', 'r');
    const fileHandleWrite = await fs.open('dest.txt', 'w');

    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    // Instead read all data in one time, it will separate in chunks
    let last_number_splitted = ''
    streamRead.on('data', (chunk) => {
        const numbers = chunk.toString('utf-8').split("\n")


        // When getting data in chunks, it is possible that the last element can be splitted
        // For example, if the ReadableStream is almost full, the number "123456" can be splitted:
        // "123" will be in the last chunk and "456" in the next chunk. 
        // So the next two functions is to verify and concatenate splitted numbers

        // If the first number is splitted, join last_number + first_number
        if (isFirstNumberSplitted(numbers)) {
            if (last_number_splitted) {
                numbers[0] = last_number_splitted.trim() + numbers[0].trim()
            }
        }

        if (isLastNumberSplitted(numbers)) {
            // Split issue
            last_number_splitted = numbers.pop()
        }

        if (!streamWrite.write(numbers)) {
            streamRead.pause()
        }
        // console.log(chunk.length) // Length of highWaterMark is 65 KiB, not 16kb like a Writable stream
    })

    const isFirstNumberSplitted = (numbers) => Number(numbers[0]) !== Number(numbers[1]) - 1
    const isLastNumberSplitted = (numbers) => {
        // numbers = [19, 20, 21]
        // 20 + 1 !== 21    // false
        // numbers = [19, 20, 2]
        // 20 + 1 !== 2     // true
        return Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])
    }

    streamWrite.on('drain', () => {
        streamRead.resume()
    })

})()