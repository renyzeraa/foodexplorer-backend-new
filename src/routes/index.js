const { Router } = require("express");

const routes = Router();

const routeModules = [
  "users",
  "plates",
  "sessions",
  "favorites",
  "ingredients",
  "orders",
  "shopping"
];

routeModules.forEach(module => {
  const moduleRoutes = require(`./${module}.routes`);
  routes.use(`/${module}`, moduleRoutes);
});

module.exports = routes;
