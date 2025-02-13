const http = require('node:http');
const fs = require('node:fs/promises');

class Butter {
    
    constructor() {
        this.server = http.createServer()
        this.routes = []

        this.server.on('request', (req, res) => {
            const BR = new ButterResponse(req, res)

            const route = this.routes.filter(row => row.url === req.url && row.method === req.method)[0]
            if (route)
                return route.callback(req, BR)
            
            return BR.status(404).json({error: `Cannot ${req.method} ${req.url}`})
        })
    }

    route(method, url, callback) {
        this.routes.push({url, method, callback})
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