const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const authConfig = require("../configs/auth");

/**
 * Classe responsável por lidar com a sessão do usuário
 */
class SessionsController {

}
