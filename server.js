const express = require('express'); // Import the library
const https = require('https'); // Use HTTPS
const fs = require('fs'); // Access File System
const bodyParser = require('body-parser'); // Middleware
const md5 = require('md5'); // Hashing Function
const {createClient} = require("redis"); // Redis Database

// Connect to Redis, forcing to Ipv4 localhost due to bug on default.
const redisClient = createClient({socket:{port:9001, host:'127.0.0.1'}});

const app = express(); // Use the library
const port = 443;

https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),
        passphrase: 'P@ssw0rd',
    }, app).listen(port, async () => {
        console.log(`Listening on Port ${port}`);
        // Connect to the redis server
        await redisClient.connect();
    }
);

app.use(bodyParser.json()); // Use the middleware (call it before anything else happens on the request)

var validate = require('./validate'); // Input Validation Code

// Verification that we are connected.
redisClient.on('connect', () => console.log('Redis Connected.'));

// Respond
app.get('/', async (req, res) => {
     res.send('Hello')
});

// Logging in a user
app.post('/login', async (request, response) => {
    const loginRequest = request.body;
    
    // Validate input 
    let errMsg = validate.validateUserNameAndPassword(loginRequest);
    // If Invalid, then send back the error.
    if (errMsg)
    {
        response.status(400);
        response.send(errMsg);
        return;
    }

    const hashedPasswordFromUser = HashPassword(loginRequest.password);
    const hashedPasswordFromDB = await GetUserFromDb(loginRequest.userName);

    if (hashedPasswordFromUser == hashedPasswordFromDB) {
        response.status(200);
        response.send(`Welcome ${loginRequest.userName.trim()}.`);
    } else {
        response.status(401); // Not authorized
        response.send('Unauthorized!');
    }
});

async function GetUserFromDb(userName) {
    return await redisClient.hGet('passwords', userName.trim());
}

async function SetUserInDb(userName, hashedPassword) {
    return await redisClient.hSet('passwords', userName, hashedPassword);
}

function HashPassword(password) {
    return md5(password.trim());
}

// Sign Up a User
const signup = async(request, response)=> {
    let reqBody = request.body;
    // Validate input 
    let errMsg = validate.validateUserNameAndPassword(reqBody);
    
    // If Invalid, then send back the error.
    if (errMsg)
    {
        response.status(400);
        response.send(errMsg);
        return;
    }

    // Username and password are valid
    let userName = reqBody.userName;
    let password = reqBody.password;
    let respMsg = '';

    // Check if user already exists.
    let hashedPasswordFromDB = await GetUserFromDb(userName);
    let hashedPasswordFromUser = HashPassword(password);
    
    if (hashedPasswordFromDB != '' && hashedPasswordFromDB != null) {
        // User already exists, compare passwords
        if (hashedPasswordFromUser == hashedPasswordFromDB) {
            respMsg = 'User already exists.';
        } else {
            SetUserInDb(userName, HashPassword(password));
            respMsg = 'User already exists, password updated.'
        }
    } else {
        // User is not found, so add to database
        SetUserInDb(userName, HashPassword(password));
        respMsg = `${userName} was succesfully signed up.`;
    }
    response.status(200);
    response.send(respMsg);
};

app.post('/signup', signup);
