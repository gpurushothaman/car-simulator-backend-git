const express = require("express");
const createUploader = require("../../middleware/createUploader");
const router = express.Router();

const upload = createUploader("src/assets/car-spares");

const {
  getSteerings,
  createSteering,
  updateSteering,
  deleteSteering,
} = require("../../controllers/admin/steeringController");

router.get("/", getSteerings);

router.post(
  "/",
  upload.fields([
    { name: "steeringThumbnail", maxCount: 1 },
    { name: "steeringModel", maxCount: 1 },
  ]),
  createSteering
);

router.put("/:id", updateSteering);

router.delete("/:id", deleteSteering);

module.exports = router;
