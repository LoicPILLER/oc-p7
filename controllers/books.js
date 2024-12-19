const Book = require("../models/Book");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

exports.getBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => {
            console.error(`Error finding book: ${error}`);
            res.status(404).json({ error });
        });
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => {
            res.status(400).json({ error });
        });
}

exports.modifyBook = (req, res, next)=> {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete bookObject._userID;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const updateBook = () => {
                    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
                        .catch((error) => res.status(400).json({ error }));
                };

                if (req.file && book.imageUrl) {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            console.error(err);
                        }
                        updateBook();
                    });
                } else {
                    updateBook();
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => res.status(200).json({message: 'Livre supprimé !'}))
                        .catch(error => res.status(400).json({error}));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => {
            res.status(500).json({ error });
        });
}

exports.getBestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => {
            res.status(500).json({ error });
        });
}

exports.addRating = (req, res, next) => {
    const { userId, rating } = req.body;

    if (!userId || typeof rating !== 'number' || rating < 0 || rating > 5) {
        console.error('Invalid input:', { userId, rating });
        return res.status(400).json({ message: 'Note ou identifiant utilisateur invalide' });
    }

    Book.findOne({ _id: req.params.id })
        .then(book => {

            if (book.ratings.some(r => r.userId === userId)) {
                return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
            }

            book.ratings.push({ userId, grade: rating });
            const totalRatings = book.ratings.length;
            const averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / totalRatings;

            book.averageRating = Math.round(averageRating);

            return book.save()
                .then(() => {
                    res.status(200).json({ message: 'Note ajoutee avec succes', book });
                })
                .catch(error => {
                    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du livre', error });
                });
        })
        .catch(error => {
            console.error('Database query error:', error);
            res.status(404).json({ message: 'Book not found', error });
        });
};


