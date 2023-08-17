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

ordersRoutes.get(
  "/:id", 
  ensureAuthenticated, 
  ordersController.show 
);

ordersRoutes.put(
  "/:id", 
  ensureAuthenticated, 
  ordersController.update
);

ordersRoutes.delete(
  "/:id", 
  ensureAuthenticated, 
  ordersController.delete
);

module.exports = ordersRoutes;
