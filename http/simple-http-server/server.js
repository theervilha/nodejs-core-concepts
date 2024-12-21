const http = require('node:http');

const server = http.createServer()

server.on('request', (request, response) => {
    console.log(`METHOD: ${request.method}`)
    console.log(`URL: ${request.url}`)
    console.log(`---------- HEADERS ------------`)
    console.log(request.headers)

    console.log(`---------- BODY ------------`)
    request.on('data', (chunk) => {
        console.log(chunk.toString())
    })
})

server.listen(8050, () => {
    console.log('Server listening on http://localhost:8050')
})