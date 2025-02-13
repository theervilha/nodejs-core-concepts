const Butter = require('../butter');


const USERS = [
    {
        id: 1,
        name: "Felipe",
        username: "felipe",
        password: "password"
    },
    {
        id: 2,
        name: "Lilly",
        username: "lilly",
        password: "lilly"
    }
]
const POSTS = [
    {
        id: 1,
        title: "This is a post title",
        body: "This is a post body!",
        userId: 1
    },
    {
        id: 2,
        title: "This is other post title",
        body: "This is a other post body!",
        userId: 2
    }
]
const SESSIONS = []


const PORT = 8001;
const server = new Butter();

// ----- FILE ROUTES ----- //
server.route('GET', '/', (req, res) => res.sendFile('./public/index.html', 'text/html'))
server.route('GET', '/login', (req, res) => res.sendFile('./public/index.html', 'text/html'))
server.route('GET', '/styles.css', (req, res) => res.sendFile('./public/styles.css', 'text/css'))
server.route('GET', '/scripts.js', (req, res) => res.sendFile('./public/scripts.js', 'text/javascript'))

// ----- JSON ROUTES ----- //
server.route('GET', '/api/posts', (req, res) => {
    console.log(req.headers)

    const posts = POSTS.map((post) => {
        post.author = USERS.find((user) => user.id === post.userId).name
        return post
    })
    res.status(200).json(posts)
})

server.route('POST', '/api/login', (req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    const getToken = () => Math.floor(Math.random() * 1000000000).toString()

    req.on('end', () => {
        const { username, password } = JSON.parse(body)
        
        const user = USERS.find(user => user.username == username)
        if (user && user.password === password) {
            const token = getToken()
            SESSIONS.push({userId: user.id, token})

            res.res.setHeader('Set-Cookie', `token=${token}; Path=/;`)
            return res.status(200).json({message: "Logged in successfully"})
        }

        return res.status(401).json({error: "Invalid username or password"})
    })
})

server.route('DELETE', '/api/logout', (req, res) => {
    
})


server.route('GET', '/api/user', (req, res) => {
    const cookies = req.headers.cookie;

    const extractToken = (cookies) => {
        const tokenIndex = cookies.indexOf("token=")
        console.log(tokenIndex)
        const finalTokenIndex = cookies.slice(tokenIndex).indexOf(";")
        if (finalTokenIndex === -1) {
            return cookies.slice(tokenIndex).split('=')[1]
        }
        return cookies.slice(tokenIndex, tokenIndex + finalTokenIndex).split('=')[1]
    }

    const token = extractToken(cookies)
    const session = SESSIONS.find((session) => session.token === token);
    console.log(token)
    console.log(cookies)
    console.log(session)
    if (session) {
        res.status(200).json({...USERS.find((user) => user.id === session.userId)})
    } else {
        res.status(401).json({error: "Unauthorized"})
    }
})

server.route('PUT', '/api/user', (req, res) => {
})


server.route('POST', '/api/posts', (req, res) => {
})


server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})