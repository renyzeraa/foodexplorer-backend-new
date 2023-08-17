const { Router } = require("express");
const ShoppingCartControllerController = require("../controllers/ShoppingCartController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const shoppingRoutes = Router();
const shoppingCartController = new ShoppingCartControllerController();

shoppingRoutes.get(
  "/:id", 
  ensureAuthenticated, 
  shoppingCartController.show
);

module.exports = shoppingRoutes;
