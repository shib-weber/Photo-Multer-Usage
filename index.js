const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Photo = require('./models/index')
const path = require('path');
const { MongoClient, GridFSBucket } = require('mongodb');
const multer = require('multer');
const { Readable } = require('stream');

const app = express();
const PORT = 2000;
const MongoUrl = 'mongodb://127.0.0.1:27017/photo';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// MongoDB connection
mongoose.connect(MongoUrl).then(() => console.log('MongoDB connected'));

let gfsBucket;
mongoose.connection.once('open', () => {
  gfsBucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });
});

// Multer setup
const storage = multer.memoryStorage();  // Use memoryStorage since we'll write manually to GridFS
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.render('home');
});

// Upload route
app.post('/data', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Convert buffer to readable stream
  const readablePhotoStream = new Readable();
  readablePhotoStream.push(req.file.buffer);
  readablePhotoStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(req.file.originalname);
  readablePhotoStream.pipe(uploadStream);

  uploadStream.on('error', (err) => {
    return res.status(500).json({ message: 'Error uploading file', err });
  });

  uploadStream.on('finish', () => {
    return res.status(201).json({ message: 'File uploaded successfully', fileId: uploadStream.id });
  });
});

app.get('/photo/:idno', async (req, res) => {
    try {
        const { idno } = req.params;

        // Find the document based on idno
        const photoDocument = await Photo.findOne({ idno });
        if (!photoDocument || !photoDocument.photo) {
            return res.status(404).send('Photo not found');
        }

        // Extract the fileId from the document
        const fileId = new mongoose.Types.ObjectId(photoDocument.photo);

        // Retrieve the file from GridFSBucket
        const downloadStream = gfsBucket.openDownloadStream(fileId);

        downloadStream.on('error', (err) => {
            return res.status(500).send('Error retrieving file');
        });

        downloadStream.pipe(res); // Stream the file directly to the client
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

app.post('/save',async(req,res)=>{
    const {idno ,name,photo}= req.body;
    const response = await Photo.create({
        idno,
        name,
        photo
    })
    res.json(response)
})

app.listen(PORT, () => {
  console.log('Server is running on PORT', PORT);
});
