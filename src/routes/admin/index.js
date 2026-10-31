const express = require("express");

const router = express.Router();
router.use("/tyre", require("./tyresRoutes"));
router.use("/steering", require("./steeringRoutes"));


module.exports = router;