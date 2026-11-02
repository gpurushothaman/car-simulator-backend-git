const express = require("express");
const createUploader = require("../../middleware/createUploader");
const router = express.Router();

const upload = createUploader("src/assets/car-spares");

const {
  getFrontBumpers,
  createFrontBumper,
  updateFrontBumper,
  deleteFrontBumper,
} = require("../../controllers/admin/frontBumperController");

router.get("/", getFrontBumpers);

router.post(
  "/",
  upload.fields([
    { name: "frontbumperThumbnail", maxCount: 1 },
    { name: "frontbumperModel", maxCount: 1 },
  ]),
  createFrontBumper
);

router.put("/:id",   updateFrontBumper,);

router.delete("/:id",   deleteFrontBumper,);

module.exports = router;
