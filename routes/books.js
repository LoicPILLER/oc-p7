const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books')

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBook);
router.post('/', booksController.createBook);
router.put('/:id', booksController.modifyBook);
router.delete('/:id', booksController.deleteBook);
router.get('/bestrating', booksController.getBestRatingBooks);

module.exports = router;
