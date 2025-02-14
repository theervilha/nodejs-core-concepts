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

// For authentication
server.beforeEach((req, res, next) => {
    const routesToAuthenticate = [
        {
            method: "GET",
            url: "/api/user"
        },
        {
            method: "PUT",
            url: "/api/user"
        },
        {
            method: "POST",
            url: "/api/posts"
        },
        {
            method: "DELETE",
            url: "/api/logout"
        }
    ]


    const route = routesToAuthenticate.find(row => row.url === req.url && row.method === req.method)
    if (!route)
        return next()

    const cookies = req.headers.cookie;
    if (!cookies)
        return res.status(401).json({error: "Unauthorized"})

    const extractToken = (cookies) => {
        const tokenIndex = cookies.indexOf(" token=")
        const finalTokenIndex = cookies.slice(tokenIndex).indexOf(";")
        if (finalTokenIndex === -1) {
            return cookies.slice(tokenIndex).split('=')[1]
        }
        return cookies.slice(tokenIndex, tokenIndex + finalTokenIndex).split('=')[1]
    }

    const token = extractToken(cookies)
    const session = SESSIONS.find((session) => session.token === token);
    if (session) {
        req.userId = session.userId;
        return next();
    } 

    return res.status(401).json({error: "Unauthorized"})
})

// For parse json body
server.beforeEach((req, res, next) => {
    if (req.headers['content-type'] !== 'application/json')
        return next()

    let body = ''
    req.on('data', (chunk) => {
        body += chunk.toString()
    })

    req.on('end', () => {
        req.body = JSON.parse(body)
        return next();
    })
})

// ----- FILE ROUTES ----- //
server.route('GET', '/', (req, res) => {
    res.sendFile('./public/index.html', 'text/html')
})
server.route('GET', '/login', (req, res) => res.sendFile('./public/index.html', 'text/html'))
server.route('GET', '/styles.css', (req, res) => res.sendFile('./public/styles.css', 'text/css'))
server.route('GET', '/scripts.js', (req, res) => res.sendFile('./public/scripts.js', 'text/javascript'))

// ----- JSON ROUTES ----- //
server.route('GET', '/api/posts', (req, res) => {
    const posts = POSTS.map((post) => {
        post.author = USERS.find((user) => user.id === post.userId).name
        return post
    })
    res.status(200).json(posts)
})

server.route('POST', '/api/login', (req, res) => {
    const getToken = () => Math.floor(Math.random() * 1000000000).toString()
    const { username, password } = req.body
    
    const user = USERS.find(user => user.username == username)
    if (user && user.password === password) {
        const token = getToken()
        SESSIONS.push({userId: user.id, token})

        res.res.setHeader('Set-Cookie', `token=${token}; Path=/;`)
        return res.status(200).json({message: "Logged in successfully"})
    }

    return res.status(401).json({error: "Invalid username or password"})
})

server.route('DELETE', '/api/logout', (req, res) => {
    const sessionIndex = SESSIONS.findIndex(session => session.userId === req.userId)
    if (sessionIndex !== -1) {
        SESSIONS.splice(sessionIndex, 1)
    }

    res.res.setHeader('Set-Cookie', 'token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    res.status(200).json({message: "User deleted successfully"})
})


server.route('GET', '/api/user', (req, res) => {
    const user = USERS.find((user) => user.id === req.userId)
    res.status(200).json(user)
})

server.route('PUT', '/api/user', (req, res) => {
    const { username, password, name } = req.body;

    const user = USERS.find(user => user.id === req.userId)
    user.username = username
    user.name = name

    if (password) {
        user.password = password
    }

    res.status(200).json({username, name, password_status: password ? "updated" : "not updated"})
})


server.route('POST', '/api/posts', (req, res) => {
    const { title, body } = req.body;

    const post = {
        id: POSTS.length + 1,
        title,
        body,
        userId: req.userId
    }

    POSTS.unshift(post) // Adds at the beginning of array
    res.status(201).json(post);
})


server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})