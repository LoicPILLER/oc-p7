const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const router = express.Router();

const booksController = require('../controllers/books')

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBook);
router.post('/', auth, multer, booksController.createBook);
router.put('/:id', multer, auth, booksController.modifyBook);
router.delete('/:id', auth, booksController.deleteBook);
router.get('/bestrating', booksController.getBestRatingBooks);

module.exports = router;
