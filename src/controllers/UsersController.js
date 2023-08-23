const { hash, compare } = require('bcryptjs')
const sqliteConnection = require('../database/sqlite')
const AppError = require('../utils/AppError')

/**
 * Classe que lida com os dados do usuário
 */
class UsersController {

  /**
   * Cria um novo usuário
   * @param {Object} req 
   * @param {Object} res 
   * @returns json
   */
  async create(req, res) {
    let { name, email, password, isAdmin } = req.body
   
    const database = await sqliteConnection()

    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    const iCountUsers = await database.get(
      'SELECT COUNT(1) as iQtd FROM users'
    )
    // o primeiro usuário a se cadastrar sempre sera o admin
    isAdmin = iCountUsers.iQtd == 0 ? true : false;

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashPassword = await hash(password, 8)

    await database.run(
      `INSERT INTO users (NAME, email, password, isAdmin)
            VALUES (?, ?, ?, ?)`,
      [name, email, hashPassword, !!isAdmin]
    )

    return res.status(201).json()
  }

  /**
   * Retorna os dados para mostrar o usuário
   * @param {Object} req 
   * @param {Object} res 
   * @returns json
   */
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