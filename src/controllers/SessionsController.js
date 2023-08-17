const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");

/**
 * Classe responsável por lidar com a sessão do usuário
 */
class SessionsController {

  /**
   * Cria e valida a sessão
   * @param {Object} request 
   * @param {Object} response 
   * @returns JSON
   */
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail está incorreto", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Senha está incorreta", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ user }, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return response.status(201).json({ user, token });
  }
}

module.exports = SessionsController;