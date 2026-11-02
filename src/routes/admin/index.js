const express = require("express");

const router = express.Router();
router.use("/tyre", require("./tyresRoutes"));
router.use("/steering", require("./steeringRoutes"));
router.use("/spoiler", require("./spoilerRoutes"));
router.use("/rearbumper", require("./rearBumperRoutes"));
router.use("/frontbumper", require("./frontBumperRoutes"));


module.exports = router;