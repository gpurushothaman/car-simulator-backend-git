const Steering = require("../../models/admin/Steering");
const Tyres = require("../../models/admin/Tyres");

exports.getAllCarCustomizeOptions = async (req, res) => {
  try {
    const steeringData = await Steering.find({ status: true });
    const tyresData = await Tyres.find({ status: true });
   
    const allOptions = {
      steering: steeringData,
      tyres: tyresData      
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
