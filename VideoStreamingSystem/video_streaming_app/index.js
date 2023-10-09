const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Authentication Middleware
function isAuthenticated(req, res, next) {
    const auth = true; // Simulated; should call Authentication Service
    if (auth) {
        return next();
    } else {
        return res.status(401).send('Unauthorized');
    }
}

app.get('/', (req, res) => {
    res.send('Video Streaming App');
});

// List Available Videos Route
app.get('/videos', isAuthenticated, async (req, res) => {
    try {
        // Fetch video metadata from MySQL Service
        const response = await axios.get('http://localhost:3307/videos');
        const videoList = response.data;

        res.json(videoList);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Stream Video Route
app.get('/video/:id', isAuthenticated, async (req, res) => {
    try {
        // Fetch video file path from File System Service using the video ID
        const videoID = req.params.id;
        const response = await axios.get(`http://localhost:3004/video/${videoID}`);
        const videoPath = response.data.path;

        // Implement video streaming logic here
        // ...

        res.send('Video streaming not implemented yet');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Video Streaming App listening at http://localhost:${port}`);
});
