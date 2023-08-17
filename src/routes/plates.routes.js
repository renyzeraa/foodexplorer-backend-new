const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");
const upload = multer(uploadConfig.MULTER);

const PlatesController = require("../controllers/PlatesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.post(
  "/",
  ensureAuthenticated,
  upload.single("picture"),
  platesController.create,
);

platesRoutes.get(
  "/", 
  platesController.index
);

platesRoutes.get(
  "/search", 
  platesController.search
); 

platesRoutes.get(
  "/:id", 
  platesController.show
);

platesRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.single("picture"),
  platesController.update,
);

platesRoutes.delete(
  "/:id", 
  ensureAuthenticated, 
  platesController.delete
);

module.exports = platesRoutes;
