const express = require("express");
const createUploader = require("../../middleware/createUploader");
const router = express.Router();

const upload = createUploader("src/assets/car-spares");

const {
  getTyres,
  createTyre,
  updateTyre,
  deleteTyre,
} = require("../../controllers/admin/tyresController");

router.get("/", getTyres);

router.post(
  "/",
  upload.fields([
    { name: "tyreThumbnail", maxCount: 1 },
    { name: "tyreModel", maxCount: 1 },
  ]),
  createTyre
);

router.put("/:id", updateTyre);

router.delete("/:id", deleteTyre);

module.exports = router;
