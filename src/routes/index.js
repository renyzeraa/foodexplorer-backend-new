const { Router } = require("express");

const usersRoutes = require("./users.routes");
const platesRoutes = require("./plates.routes");
const favoriteRoutes = require("./favorite.routes");
const sessionsRoutes = require("./sessions.routes");
const ingredientsRoutes = require("./ingredients.routes");
const ordersRoutes = require("./orders.routes");
const shoppingRoutes = require("./shopping.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/plates", platesRoutes);
routes.use("/favorites", favoriteRoutes);
routes.use("/ingredients", ingredientsRoutes);
routes.use("/orders", ordersRoutes);
routes.use("/shopping", shoppingRoutes);


module.exports = routes;
