const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://loic_pllr:j577RkdyK5MNlVwZ@cluster0.ps3ct7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.log('Connexion à MongoDB échouée !', err));

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
