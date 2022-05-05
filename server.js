const express = require('express'); // Import the library
const bodyParser = require('body-parser'); // Middleware
const app = express(); // Use the library
const port = 3000;

app.use(bodyParser.json()); // Use the middleware (call it before anything else happens on the request)

// Listen
app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
});

// Respond
app.get('/', (req, res) => {
    res.send('Hello')
});

app.post('/login', (request, response) => {
    const loginRequest = request.body;
    if (loginRequest.userName == 'perkley@hotmail.com' && loginRequest.password == 'Abc123!') {
        response.status(200);
        response.send("Welcome.");
    } else {
        response.status(401); // Not authorized
        response.send("Unauthorized!");
    }
})