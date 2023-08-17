const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

/**
 * Valida o JWT token para acessar o front end da aplicação
 * @param {Object} request 
 * @param {Object} response 
 * @param {Object} next 
 * @returns 
 */
async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token não informado", 401);
  }

  const [, token] = authHeader.split(" ");
  try {
    const { sub: user_id, user } = verify(
      token, 
      authConfig.jwt.secret
    );

    request.user = {
      id: Number(user_id),
      isAdmin: Boolean(user.isAdmin),
    };
    return next();
  } 
  catch {
    throw new AppError("JWT token inválido, Erro no middleware", 401);
  }
}

module.exports = ensureAuthenticated;