const { Router } = require("express");

// Cria um objeto Router para lidar com as rotas.
const routes = Router();
// Lista de módulos de rotas disponíveis no aplicativo.
const routeModules = [
  "users",
  "plates",
  "sessions",
  "favorites",
  "ingredients",
  "orders",
  "shopping"
];

// Itera sobre cada módulo e incorpora suas rotas ao aplicativo principal.
routeModules.forEach(module => {
  // Importa as rotas específicas para o módulo atual.
  const moduleRoutes = require(`./${module}.routes`);
  // Define uma rota base para o módulo e anexa as rotas específicas a ela.
  routes.use(`/${module}`, moduleRoutes);
});

module.exports = routes;
