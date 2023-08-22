const { Router } = require("express");
const OrdersController = require("../controllers/OrdersController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post(
  "/", 
  ensureAuthenticated, 
  ordersController.create
);

ordersRoutes.get(
  "/", 
  ensureAuthenticated, 
  ordersController.index
);

module.exports = ordersRoutes;
