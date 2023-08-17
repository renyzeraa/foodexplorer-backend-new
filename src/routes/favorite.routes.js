const { Router } = require("express");

const FavoritesController = require("../controllers/FavoritesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const favoriteRoutes = Router();

const favoritesController = new FavoritesController();

favoriteRoutes.post(
  "/favorite_plates/:plate_id",
  ensureAuthenticated,
  favoritesController.create,
);

favoriteRoutes.get(
  "/favorite_plates/:plate_id",
  ensureAuthenticated,
  favoritesController.show,
);

favoriteRoutes.get(
  "/favorite_plates",
  ensureAuthenticated,
  favoritesController.index,
);

favoriteRoutes.delete(
  "/favorite_plates/:plate_id",
  ensureAuthenticated,
  favoritesController.delete,
);

module.exports = favoriteRoutes;
