const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const books = require('./routes/books');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use('/api/books', books);

mongoose.connect('mongodb+srv://maximocam03_db_user:qBClEGgGaIuCMQXR@clustermach.7fxtskn.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMACH')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

console.log('Server is running on port 4000');

app.listen(4000);
