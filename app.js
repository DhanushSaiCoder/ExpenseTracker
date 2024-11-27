const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const baseUrl = process.env.URL
app.use(express.json())
app.use(express.static('public'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'))

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Cannot connect to DB :(', err);
    });

