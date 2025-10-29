const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function auth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Credenciais não fornecidas' })
  }

  const base64Credentials = authHeader.split(' ')[1]
  let credentials
  try {
    credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  } catch {
    return res.status(401).json({ message: 'Token inválido' })
  }

  const [username, password] = credentials.split(':')
  if (!username || !password) {
    return res.status(401).json({ message: 'Credenciais inválidas' })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' })

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return res.status(401).json({ message: 'Senha incorreta' })

  req.user = user
  next()
}

module.exports = auth