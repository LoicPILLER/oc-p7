const Book = require("../models/Book");

exports.getBook = (req, res, next) => {
    console.log(`Received GET request for book with id: ${req.params.id}`);
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => {
            console.error(`Error finding book: ${error}`);
            res.status(404).json({ error });
        });
}

exports.createBook = (req, res, next) => {
    console.log('Received POST request with body:', req.body);
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => {
            console.error(`Error saving book: ${error}`);
            res.status(400).json({ error });
        });
}

exports.modifyBook = (req, res, next)=> {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => {
            res.status(500).json({ error });
        });
}

exports.getBestRatingBooks = (req, res, next) => {
    console.log('Received GET request for top 3 books by rating');
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => {
            res.status(500).json({ error });
        });
}