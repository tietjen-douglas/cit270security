const express = require('express'); // Import the library
const app = express(); // Use the library
const port = 3000;

// Listen
app.listen(port, () => {
    console.log(`Listening on Port ${port}`)
});

// Respond
app.get('/', (req, res) => {
    res.send('Hello')
});
