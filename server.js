const express = require('express'); // Import the library
const bodyParser = require('body-parser'); // Middleware
const md5 = require('md5');
const redis = require("redis")
const redisClient = redis.createClient();

const app = express(); // Use the library
const port = 3000;

app.use(bodyParser.json()); // Use the middleware (call it before anything else happens on the request)

(async() => {
    await redisClient.connect();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
})

// Listen
app.listen(port, async () => {
     console.log(`Listening on Port ${port}`)
});

// Respond
app.get('/', async (req, res) => {
     res.send('Hello')
});

app.post('/login', async (request, response) => {
    const loginRequest = request.body;
    const hashedPasswordFromUser = md5(loginRequest.password);
    
    var hashedPasswordFromDB = await redisClient.hGet('passwords', loginRequest.userName, function(err, reply){
        console.log('hashed in DB:', reply);
    });

    if (loginRequest.userName == 'perkley@hotmail.com' && hashedPasswordFromUser == hashedPasswordFromDB) {
        response.status(200);
        response.send(`Welcome.`);
    } else {
        response.status(401); // Not authorized
        response.send("Unauthorized!");
    }
})