const fs = require("fs");
const path = require("path");
const Steering = require("../../models/admin/Steering");

exports.getSteerings = async (req, res) => {
  try {
    const steerings = await Steering.find();

    res.status(200).json({
      success: true,
      count: steerings.length,
      data: steerings,
    });
  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createSteering = async (req, res) => {
  try {
    const createData = { ...req.body };

    const steeringFile = req.files?.steeringThumbnail?.[0];
    const steeringModelFile = req.files?.steeringModel?.[0];

    if (steeringFile) {
      const folder = path.join(
        "src/assets/car-spares/steerings/thumb",
        steeringFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, steeringFile.filename);

      fs.renameSync(steeringFile.path, destination);

      createData.thumbnailPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.thumbnailFileName = steeringFile.filename;
    }

    if (steeringModelFile) {
      const folder = path.join(
        "src/assets/car-spares/steerings/model",
        steeringModelFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, steeringModelFile.filename);

      fs.renameSync(steeringModelFile.path, destination);

      createData.modelPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.modelFileName = steeringModelFile.filename;
    }

    let result;

    if (createData.steeringId) {
      if (steeringFile) {
        const steeringData = await Steering.findById(
          createData.steeringId
        );
        const folder = path.join(
          "src/assets/car-spares/steerings/thumb",
          steeringData.thumbnailFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      if (steeringModelFile) {
        const steeringData = await Steering.findById(
          createData.steeringId
        );
        const folder = path.join(
          "src/assets/car-spares/steerings/model",
          steeringData.modelFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      const steeringId = createData?.steeringId;
      delete createData.steeringId;

      result = await Steering.findByIdAndUpdate(
        steeringId,
        createData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Steering not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      result = await Steering.create(createData);

      return res.status(201).json({
        success: true,
        data: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateSteering = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const updated = await Steering.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteSteering = async (req, res) => {
  try {
    const steeringData = await Steering.findById(
      req.params.id
    );
    const thumbFolder = path.join("src/assets/car-spares/steerings/thumb", steeringData?.thumbnailFileName?.split(".")?.[0]);   
    if (thumbFolder) {
      fs.rmSync(thumbFolder, { recursive: true, force: true });
    }
    const modelFolder = path.join("src/assets/car-spares/steerings/model", steeringData?.modelFileName?.split(".")?.[0]);   
    if (modelFolder) {
      fs.rmSync(modelFolder, { recursive: true, force: true });
    }

    const deletedSteering =
      await Steering.findByIdAndDelete(req.params.id);

    if (!deletedSteering) {
      return res.status(404).json({
        success: false,
        message: "Steering not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Steering deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
