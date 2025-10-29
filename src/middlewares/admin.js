function adminMiddleware(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado: apenas administradores' })
  }
  next()
}

module.exports = adminMiddleware