const Steering = require("../../models/admin/Steering");
const Tyres = require("../../models/admin/Tyres");
const Spoiler = require("../../models/admin/Spoiler");
const RearBumper = require("../../models/admin/RearBumper");
const FrontBumper = require("../../models/admin/FrontBumper");

exports.getAllCarCustomizeOptions = async (req, res) => {
  try {
    const steeringData = await Steering.find({ status: true });
    const tyresData = await Tyres.find({ status: true });
    const spoilerData = await Spoiler.find({ status: true });
    const rearbumperData = await RearBumper.find({ status: true });
    const frontbumperData = await FrontBumper.find({ status: true });
   
    const allOptions = {
      steering: steeringData,
      tyres: tyresData,
      spoiler: spoilerData,
      rearbumper:rearbumperData,
      frontbumper:frontbumperData,

    };

    res.status(200).json({
      success: true,
      data: allOptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
