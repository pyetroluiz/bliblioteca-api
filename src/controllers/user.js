const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function register(req, res) {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username e password são obrigatórios' })
  }

  if (password.length < 4) {
    return res.status(400).json({ message: 'Password deve ter pelo menos 4 caracteres' })
  }

  const userExists = await prisma.user.findUnique({ where: { username } })
  if (userExists) {
    return res.status(400).json({ message: 'Username já existe' })
  }

  const userCount = await prisma.user.count()
  const isAdmin = userCount === 0

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { username, password: hashedPassword, isAdmin }
  })

  res.status(201).json({ message: 'Usuário criado com sucesso', userId: user.id })
}

module.exports = { register }