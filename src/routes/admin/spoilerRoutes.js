const express = require("express");
const createUploader = require("../../middleware/createUploader");
const router = express.Router();

const upload = createUploader("src/assets/car-spares");

const {
  getSpoilers,
  createSpoiler,
  updateSpoiler,
  deleteSpoiler,
} = require("../../controllers/admin/spoilerController");

router.get("/", getSpoilers);

router.post(
  "/",
  upload.fields([
    { name: "spoilerThumbnail", maxCount: 1 },
    { name: "spoilerModel", maxCount: 1 },
  ]),
  createSpoiler
);

router.put("/:id",   updateSpoiler,);

router.delete("/:id", deleteSpoiler);

module.exports = router;
