const express = require('express');
const cors = require('cors');
const client = require('./db/conn.js');
const multer = require('multer');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// **Routes**

// Home Route
app.get('/', (req, res) => {
    res.json({ "message": 'Hello World!' });
});

// Get Blogs by Category
app.get('/blog/:cat', async (req, res) => {
    try {
        const result = await client.query(
            req.params.cat !== 'all' ? 
            `SELECT * FROM blogs WHERE category = '${req.params.cat}'` : 
            'SELECT * FROM blogs'
        );
        res.json({ "data": result.rows });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// Get Blog by ID
app.get('/blogbyid/:id', async (req, res) => {
    try {
        const result = await client.query(`SELECT * FROM blogs WHERE id = ${req.params.id}`);
        res.json({ "data": result.rows });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// Add a New Blog
app.post('/blog', async (req, res) => {
    try {
        const result = await client.query(
            'INSERT INTO blogs (title, image, post, category) VALUES ($1, $2, $3, $4)',
            [req.body.title, req.body.image, req.body.post, req.body.category]
        );
        res.json({ "message": "Added new blog", "desc": result.rowCount });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// Upload Blog Image
app.post('/blogimage', upload.single('file'), (req, res) => {
    res.json(req.file);
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
