const express = require('express');
const app = express();
const port = 3000;

// Middleware (none for now, but you might add some here later)

// Routes
app.get('/', (req, res) => {
    res.send('Authentication Service');
});

app.post('/authenticate', (req, res) => {
    const token = req.headers['authorization'];
    if (token === '123') {
        res.status(200).send({ authenticated: true });
    } else {
        res.status(401).send({ authenticated: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Authentication Service listening at http://localhost:${port}`);
});
