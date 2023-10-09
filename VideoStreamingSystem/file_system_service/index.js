const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './stored_files';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('File System Service');
});

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    if (!filePath) {
        return res.status(500).send('File not uploaded');
    }
    res.status(200).send({ path: filePath });
});

app.get('/download/:filename', (req, res) => {
    // Define the path to the file
    const filePath = path.join(__dirname, 'stored_files', req.params.filename);

    // Check if the file exists
    fs.exists(filePath, (exists) => {
        if (exists) {
            // Set headers and send the file
            res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.filename);
            res.sendFile(filePath);
        } else {
            res.status(404).send('File not found');
        }
    });
});

app.get('/list_files', (req, res) => {
    const directoryPath = path.join(__dirname, 'stored_files');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        res.status(200).send({ files: files });
    });
});


app.listen(port, () => {
    console.log(`File System Service listening at http://localhost:${port}`);
});
