const fs = require("fs");
const path = require("path");
const FrontBumper = require("../../models/admin/FrontBumper");

exports.getFrontBumpers = async (req, res) => {
  try {
    const frontbumpers = await FrontBumper.find();

    res.status(200).json({
      success: true,
      count: frontbumpers.length,
      data: frontbumpers,
    });
  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createFrontBumper = async (req, res) => {
  try {
    const createData = { ...req.body };

    const frontbumperFile = req.files?.frontbumperThumbnail?.[0];
    const frontbumperModelFile = req.files?.frontbumperModel?.[0];

    if (frontbumperFile) {
      const folder = path.join(
        "src/assets/car-spares/frontbumpers/thumb",
        frontbumperFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, frontbumperFile.filename);

      fs.renameSync(frontbumperFile.path, destination);

      createData.thumbnailPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.thumbnailFileName = frontbumperFile.filename;
    }

    if (frontbumperModelFile) {
      const folder = path.join(
        "src/assets/car-spares/frontbumpers/model",
        frontbumperModelFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, frontbumperModelFile.filename);

      fs.renameSync(frontbumperModelFile.path, destination);

      createData.modelPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.modelFileName = frontbumperModelFile.filename;
    }

    let result;

    if (createData.frontbumperId) {
      if (frontbumperFile) {
        const frontbumperData = await FrontBumper.findById(
          createData.frontbumperId
        );
        const folder = path.join(
          "src/assets/car-spares/frontbumpers/thumb",
          frontbumperData.thumbnailFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      if (frontbumperModelFile) {
        const frontbumperData = await FrontBumper.findById(
          createData.frontbumperId
        );
        const folder = path.join(
          "src/assets/car-spares/frontbumpers/model",
          frontbumperData.modelFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      const frontbumperId = createData?.frontbumperId;
      delete createData.frontbumperId;

      result = await FrontBumper.findByIdAndUpdate(
        frontbumperId,
        createData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "FrontBumper not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      result = await FrontBumper.create(createData);

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

exports.updateFrontBumper = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const updated = await FrontBumper.findByIdAndUpdate(
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

exports.deleteFrontBumper = async (req, res) => {
  try {
    const frontbumperData = await FrontBumper.findById(
      req.params.id
    );
    const thumbFolder = path.join("src/assets/car-spares/frontbumpers/thumb", frontbumperData?.thumbnailFileName?.split(".")?.[0]);   
    if (thumbFolder) {
      fs.rmSync(thumbFolder, { recursive: true, force: true });
    }
    const modelFolder = path.join("src/assets/car-spares/frontbumpers/model", frontbumperData?.modelFileName?.split(".")?.[0]);   
    if (modelFolder) {
      fs.rmSync(modelFolder, { recursive: true, force: true });
    }

    const deletedFrontBumper =
      await FrontBumper.findByIdAndDelete(req.params.id);

    if (!deletedFrontBumper) {
      return res.status(404).json({
        success: false,
        message: "FrontBumper not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FrontBumper deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
