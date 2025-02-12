const http = require('node:http');
const fs = require('node:fs/promises');

const server = http.createServer();

server.on('request', async (request, response) => {
    if (request.url === "/" && request.method === "GET") {
        response.setHeader("Content-Type", "text/html")

        const fileHandle = await fs.open("static/index.html", "r");
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response) // Read from stream and write to the response
    }
    if (request.url === "/styles.css" && request.method === "GET") {
        response.setHeader("Content-Type", "text/css")

        const fileHandle = await fs.open("static/index.css", "r");
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(response)
    }

    if (request.url === '/upload' && request.method === 'PUT') {
        const fileHandle = await fs.open('storage/image.jpeg', 'w')
        const fileStream = fileHandle.createWriteStream();

        request.pipe(fileStream);
        request.on('end', () => {
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({message: "File was uploaded successfully!"}));
        })
    }
})

server.listen(9000, () => {
    console.log('Server listening on http://localhost:9000')
})