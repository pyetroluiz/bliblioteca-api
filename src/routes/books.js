const express = require('express')
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook } = require('../controllers/book')
const auth = require('../middlewares/auth')
const adminMiddleware = require('../middlewares/admin')
const router = express.Router()

router.get('/', auth, getAllBooks)
router.get('/:id', auth, getBookById)
router.post('/', auth, adminMiddleware, createBook)
router.patch('/:id', auth, adminMiddleware, updateBook)
router.delete('/:id', auth, adminMiddleware, deleteBook)
router.post('/:id/borrow', auth, borrowBook)
router.post('/:id/return', auth, returnBook)

module.exports = router