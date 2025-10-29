const express = require('express')
const authRoutes = require('./routes/auth')
const booksRoutes = require('./routes/books')
const app = express()

app.use(express.json())
app.use('/auth', authRoutes)
app.use('/books', booksRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})