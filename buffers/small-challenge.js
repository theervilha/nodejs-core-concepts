// Converter o seguinte binário para utf-8:
// 0100 1000 0110 1001 0010 0001
const { Buffer } = require('buffer')
const buff = Buffer.from([0x48, 0x69, 0x21])
console.log(buff.toString('utf-8'))


// Outra forma mais fácil
//const buff = Buffer.from("string", "ascii")
console.log(buff)
console.log(buff.toString("utf-8"))

