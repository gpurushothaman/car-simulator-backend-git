const express = require("express");

const router = express.Router();

router.use("/car-customize-options", require("./carCustomizeOptionsRoutes"));

module.exports = router;