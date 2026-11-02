const express = require("express");
const createUploader = require("../../middleware/createUploader");
const router = express.Router();

const upload = createUploader("src/assets/car-spares");

const {
  getRearBumpers,
  createRearBumper,
  updateRearBumper,
  deleteRearBumper,
} = require("../../controllers/admin/rearBumperController");

router.get("/", getRearBumpers);

router.post(
  "/",
  upload.fields([
    { name: "rearbumperThumbnail", maxCount: 1 },
    { name: "rearbumperModel", maxCount: 1 },
  ]),
  createRearBumper
);

router.put("/:id",   updateRearBumper,);

router.delete("/:id",   deleteRearBumper,);

module.exports = router;
