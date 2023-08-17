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

  /**
   * Método que define a alteração do usuário
   * @param {Object} req 
   * @param {Object} res 
   * @deprecated No momento não esta sendo utilizado, pois não foi feita a página para editar o perfil do usuário
   */
  async update(req, res) {
    try {
      const { name, email, password, old_password, isAdmin } = req.body
      const user_id = req.user.id

      const database = await sqliteConnection()

      const user = await database.get('SELECT * FROM users WHERE id = (?)', [
        user_id
      ])

      if (!user) {
        throw new AppError('Usuario não encontrado')
      }

      const userWithUpdatedEmail = await database.get(
        'SELECT * FROM users WHERE  email = (?)',
        [email]
      )

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError('Email já está em uso.')
      }

      if (password && !old_password) {
        throw new AppError('Você deve informar a senha antiga')
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password)

        if (!checkOldPassword) {
          throw new AppError('Senha antiga está incorreta')
        }

        user.password = await hash(password, 4)
      }

      user.name = name ?? user.name
      user.email = email ?? user.email

      if (isAdmin !== undefined) {
        user.isAdmin = isAdmin
      }

      await database.run(
        `
        UPDATE users SET name = ?,
                         email = ?,
                         password = ?,
                         isAdmin = ?,
                         updated_at = DATETIME("now")
                         WHERE id = ?`,
        [
          user.name, 
          user.email, 
          user.password, 
          user.isAdmin, 
          user_id
        ]
      )

      return res.json({})
    } 
    catch (error) {
      console.log('update user error: ' + error)
      return res.status(400).json({
        message: error.message 
      })
    }
  }
}

module.exports = UsersController