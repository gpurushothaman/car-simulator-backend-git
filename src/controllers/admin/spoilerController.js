const fs = require("fs");
const path = require("path");
const Spoiler = require("../../models/admin/Spoiler");

exports.getSpoilers = async (req, res) => {
  try {
    const spoilers = await Spoiler.find();

    res.status(200).json({
      success: true,
      count: spoilers.length,
      data: spoilers,
    });
  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createSpoiler = async (req, res) => {
  try {
    const createData = { ...req.body };

    const spoilerFile = req.files?.spoilerThumbnail?.[0];
    const spoilerModelFile = req.files?.spoilerModel?.[0];

    if (spoilerFile) {
      const folder = path.join(
        "src/assets/car-spares/spoilers/thumb",
        spoilerFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, spoilerFile.filename);

      fs.renameSync(spoilerFile.path, destination);

      createData.thumbnailPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.thumbnailFileName = spoilerFile.filename;
    }

    if (spoilerModelFile) {
      const folder = path.join(
        "src/assets/car-spares/spoilers/model",
        spoilerModelFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, spoilerModelFile.filename);

      fs.renameSync(spoilerModelFile.path, destination);

      createData.modelPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.modelFileName = spoilerModelFile.filename;
    }

    let result;

    if (createData.spoilerId) {
      if (spoilerFile) {
        const spoilerData = await Spoiler.findById(
          createData.spoilerId
        );
        const folder = path.join(
          "src/assets/car-spares/spoilers/thumb",
          spoilerData.thumbnailFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      if (spoilerModelFile) {
        const spoilerData = await Spoiler.findById(
          createData.spoilerId
        );
        const folder = path.join(
          "src/assets/car-spares/spoilers/model",
          spoilerData.modelFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      const spoilerId = createData?.spoilerId;
      delete createData.spoilerId;

      result = await Spoiler.findByIdAndUpdate(
        spoilerId,
        createData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Spoiler not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      result = await Spoiler.create(createData);

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

exports.updateSpoiler = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const updated = await Spoiler.findByIdAndUpdate(
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

exports.deleteSpoiler = async (req, res) => {
  try {
    const spoilerData = await Spoiler.findById(
      req.params.id
    );
    const thumbFolder = path.join("src/assets/car-spares/spoilers/thumb", spoilerData?.thumbnailFileName?.split(".")?.[0]);   
    if (thumbFolder) {
      fs.rmSync(thumbFolder, { recursive: true, force: true });
    }
    const modelFolder = path.join("src/assets/car-spares/spoilers/model", spoilerData?.modelFileName?.split(".")?.[0]);   
    if (modelFolder) {
      fs.rmSync(modelFolder, { recursive: true, force: true });
    }

    const deletedSpoiler =
      await Spoiler.findByIdAndDelete(req.params.id);

    if (!deletedSpoiler) {
      return res.status(404).json({
        success: false,
        message: "Spoiler not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Spoiler deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
