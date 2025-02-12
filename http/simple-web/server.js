const Butter = require('./butter');

const PORT = 4070;

const server = new Butter();

server.route("GET", "/upload", (req, res) => {
    console.log('requesting:',req.url)
    res.status(200).sendFile("./static/index.css", "text/css")
})

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})