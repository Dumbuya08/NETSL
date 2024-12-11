const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define the File Schema
const fileSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save to the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Routes
app.post('/upload', upload.single('files'), async (req, res) => {
    try {
        const file = new File({
            filename: req.body.filename,
            filepath: `/uploads/${req.file.filename}`,
        });

        await file.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            file: {
                filename: file.filename,
                filepath: file.filepath,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload file' });
    }
});

app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve files' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
