const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const favoriteRoutes = Router();

const favoritesController = new FavoritesController();

favoriteRoutes.post(
  "/:plate_id",
  ensureAuthenticated,
  favoritesController.create,
);

favoriteRoutes.get(
  "/:plate_id",
  ensureAuthenticated,
  favoritesController.show,
);

favoriteRoutes.get(
  "/",
  ensureAuthenticated,
  favoritesController.index,
);

favoriteRoutes.delete(
  "/:plate_id",
  ensureAuthenticated,
  favoritesController.delete,
);

module.exports = favoriteRoutes;
