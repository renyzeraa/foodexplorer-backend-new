const { Router } = require("express");

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post(
  "/", 
  usersController.create
);
usersRoutes.put(
  "/", 
  ensureAuthenticated
);
usersRoutes.get(
  "/:email", 
  usersController.show
);

module.exports = usersRoutes;
