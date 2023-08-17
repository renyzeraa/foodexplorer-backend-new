const { hash, compare } = require('bcryptjs')
const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')

class UsersController {
  async create(req, res) {
    const { name, email, password, isAdmin } = req.body

    const database = await sqliteConnection()

    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashPassword = await hash(password, 8)
    const userIsAdmin = isAdmin === true 

    await database.run(
      `INSERT INTO users (NAME, email, password, isAdmin)
            VALUES (?, ?, ?, ?)`,
      [name, email, hashPassword, userIsAdmin]
    )

    return res.status(201).json()
  }

  async show(req, res) {
    const { email } = req.params

    const database = await sqliteConnection()

    const user = await database.get('SELECT * FROM users WHERE email = (?)', [
      email
    ])

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    return res.json(user)
  }
}

module.exports = UsersController