const { Buffer } = require('buffer')

const memoryContainer = Buffer.alloc(4) // 4 bytes (32 bits)
// Will be equivalent to <Buffer 00 00 00 00>

memoryContainer[0] = 0xf4
memoryContainer[1] = 0x34
memoryContainer[2] = 0xb6
memoryContainer[3] = 0xff
console.log(memoryContainer)
console.log(memoryContainer[0]) // It logs "244" because it's converted from hexadecimal to decimal when printing
console.log(memoryContainer[1])
console.log(memoryContainer[2])
console.log(memoryContainer[3])

console.log(memoryContainer.toString("base64"))