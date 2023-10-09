const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;
const axios = require('axios');


const fs = require('fs');
const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


async function isAuthenticated(req, res, next) {
    try {
        const token = req.headers['authorization'];
        const response = await axios.post('http://localhost:3000', {}, {
            headers: { 'Authorization': token }
        });

        if (response.data.authenticated) {
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/upload', isAuthenticated, upload.single('videoFile'), async (req, res) => {
    try {
        // File is now uploaded and is available at req.file
        const { originalname, path: tempPath } = req.file;

        // Send the file to the File System Service
        const fileData = fs.readFileSync(tempPath);
        const response = await axios.post('http://localhost:3004/upload', fileData, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename=${originalname}`
            }
        });

        // Delete the temporary file
        fs.unlinkSync(tempPath);

        // You would typically also store file metadata in MySQL here
        res.send('File uploaded and moved to permanent storage');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Upload Video App listening at http://localhost:${port}`);
});
