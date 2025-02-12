const http = require('node:http');
const fs = require('node:fs/promises');
const { error } = require('node:console');

class Butter {
    
    constructor() {
        this.server = http.createServer()
        this.routes = []

        this.server.on('request', (req, res) => {
            console.log("New Request arrived:",req.url)

            const BR = new ButterResponse(req, res)

            const route = this.routes.filter(row => row.url === req.url && row.method === req.method)[0]
            if (route)
                return route.callback(req, BR)
            
            return BR.status(404).json({error: 'Route not found'})
        })
    }

    route(method, url, callback) {
        this.routes.push({url, method, callback})
        console.log('Added new route:',this.routes)
    }

    listen = (port, cb) => {
        this.server.listen(port, () => {
            cb();
        })
    }

}

class ButterResponse extends http.ServerResponse {
    constructor(req, res) {
        super(req)
        this.res = res;
    }

    status(statusCode) {
        this.res.statusCode = statusCode
        return this
    }

    json(data) {
        this.res.setHeader('Content-Type', 'application/json')
        this.res.end(JSON.stringify(data))
    }

    async sendFile(filepath, contentType) {
        this.res.setHeader('Content-Type', contentType)

        const fileHandle = await fs.open(filepath, 'r');
        const fileStream = fileHandle.createReadStream();
        fileStream.pipe(this.res);
    }
}

module.exports = Butter