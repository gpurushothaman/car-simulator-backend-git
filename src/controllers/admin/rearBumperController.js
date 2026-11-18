const fs = require("fs");
const path = require("path");
const RearBumper = require("../../models/admin/RearBumper");

exports.getRearBumpers = async (req, res) => {
  try {
    const rearbumpers = await RearBumperId.find();

    res.status(200).json({
      success: true,
      count: rearbumpers.length,
      data: rearbumpers,
    });
  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createRearBumper = async (req, res) => {
  try {
    const createData = { ...req.body };

    const rearbumperFile = req.files?.rearbumperThumbnail?.[0];
    const rearbumperModelFile = req.files?.rearbumperModel?.[0];

    if (rearbumperFile) {
      const folder = path.join(
        "src/assets/car-spares/rearbumpers/thumb",
        rearbumperFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, rearbumperFile.filename);

      fs.renameSync(rearbumperFile.path, destination);

      createData.thumbnailPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.thumbnailFileName = rearbumperFile.filename;
    }

    if (rearbumperModelFile) {
      const folder = path.join(
        "src/assets/car-spares/rearbumpers/model",
        rearbumperModelFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, rearbumperModelFile.filename);

      fs.renameSync(rearbumperModelFile.path, destination);

      createData.modelPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.modelFileName = rearbumperModelFile.filename;
    }

    let result;

    if (createData.rearbumperId) {
      if (rearbumperFile) {
        const rearbumperData = await RearBumper.findById(
          createData.rearbumperId
        );
        const folder = path.join(
          "src/assets/car-spares/rearbumpers/thumb",
          rearbumperData.thumbnailFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      if (rearbumperModelFile) {
        const rearbumperData = await RearBumper.findById(
          createData.rearbumperId
        );
        const folder = path.join(
          "src/assets/car-spares/rearbumpers/model",
          rearbumperData.modelFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      const rearbumperId = createData?.rearbumperId;
      delete createData.rearbumperId;

      result = await RearBumper.findByIdAndUpdate(
        rearbumperId,
        createData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "RearBumper not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      result = await RearBumper.create(createData);

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

exports.updateRearBumper = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const updated = await RearBumper.findByIdAndUpdate(
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

exports.deleteRearBumper = async (req, res) => {
  try {
    const rearbumperData = await RearBumper.findById(
      req.params.id
    );
    const thumbFolder = path.join("src/assets/car-spares/rearbumpers/thumb", rearbumperData?.thumbnailFileName?.split(".")?.[0]);   
    if (thumbFolder) {
      fs.rmSync(thumbFolder, { recursive: true, force: true });
    }
    const modelFolder = path.join("src/assets/car-spares/rearbumpers/model", rearbumperData?.modelFileName?.split(".")?.[0]);   
    if (modelFolder) {
      fs.rmSync(modelFolder, { recursive: true, force: true });
    }

    const deletedRearBumper =
      await RearBumper.findByIdAndDelete(req.params.id);

    if (!deletedRearBumper) {
      return res.status(404).json({
        success: false,
        message: "RearBumper not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "RearBumper deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
