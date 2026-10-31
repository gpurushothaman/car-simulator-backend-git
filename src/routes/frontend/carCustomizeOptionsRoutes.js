const express = require("express");
const router = express.Router();

const {
  getAllCarCustomizeOptions,
} = require("../../controllers/frontend/carCustomizeOptionsController");

router.get("/", getAllCarCustomizeOptions);

module.exports = router;
