const net = require('net')
const readline = require('readline/promises')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const clearLine = () => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(0, () => {
            resolve()
        })
    })
}


const moveCursor = () => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(0, -1, () => {
            resolve()
        })
    })
}


// If there is no server, there is no client.

// Client é um tipo net.Socket, o mesmo parâmetro usado no evento .on('connection') do server
// Client também é uma stream, então pode usar client.write, etc...
let id
const client = net.createConnection({ 'host': '127.0.0.1', 'port': '3000' }, async () => {
    console.log('connected')
    ask_question()
})

const ask_question = async () => {
    const message = await rl.question("Enter a message > ");
    await moveCursor()
    await clearLine()
    client.write(`${id}-message-${message}`)
}

client.on('data', async (data) => {
    console.log()
    await moveCursor()
    await clearLine()

    if (data.toString('utf-8').substring(0, 3) === 'id-') {
        id = data.toString('utf-8').substring(3)
        console.log(`Your id is ${id}!\n`)
    } else {
        console.log(data.toString('utf-8'))
        ask_question()
    }
})

client.on('end', () => {
    console.log('Ended.')
})
