const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getAllBooks(req, res) {
  const books = await prisma.book.findMany()
  res.json(books)
}

async function getBookById(req, res) {
  const { id } = req.params
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } })
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' })
  res.json(book)
}

async function createBook(req, res) {
  const { title, author } = req.body
  if (!title || !author) {
    return res.status(400).json({ message: 'Title e author são obrigatórios' })
  }
  const book = await prisma.book.create({ data: { title, author } })
  res.status(201).json({ message: 'Livro criado', book })
}

async function updateBook(req, res) {
  const { id } = req.params
  const { title, author, available } = req.body
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } })
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' })
  const updated = await prisma.book.update({
    where: { id: parseInt(id) },
    data: { title, author, available }
  })
  res.json({ message: 'Livro atualizado', book: updated })
}

async function deleteBook(req, res) {
  const { id } = req.params
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } })
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' })
  await prisma.book.delete({ where: { id: parseInt(id) } })
  res.json({ message: 'Livro removido' })
}

async function borrowBook(req, res) {
  const { id } = req.params
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } })
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' })
  if (!book.available) return res.status(400).json({ message: 'Livro indisponível' })
  await prisma.book.update({ where: { id: parseInt(id) }, data: { available: false } })
  res.json({ message: 'Livro emprestado com sucesso' })
}

async function returnBook(req, res) {
  const { id } = req.params
  const book = await prisma.book.findUnique({ where: { id: parseInt(id) } })
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' })
  if (book.available) return res.status(400).json({ message: 'Livro já está disponível' })
  await prisma.book.update({ where: { id: parseInt(id) }, data: { available: true } })
  res.json({ message: 'Livro devolvido com sucesso' })
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook }