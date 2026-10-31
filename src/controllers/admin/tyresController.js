const fs = require("fs");
const path = require("path");
const Tyres = require("../../models/admin/Tyres");

exports.getTyres = async (req, res) => {
  try {
    const tyres = await Tyres.find();

    res.status(200).json({
      success: true,
      count: tyres.length,
      data: tyres,
    });
  } catch (error) {
    console.log("ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createTyre = async (req, res) => {
  try {
    const createData = { ...req.body };

    const tyreFile = req.files?.tyreThumbnail?.[0];
    const tyreModelFile = req.files?.tyreModel?.[0];

    if (tyreFile) {
      const folder = path.join(
        "src/assets/car-spares/tyres/thumb",
        tyreFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, tyreFile.filename);

      fs.renameSync(tyreFile.path, destination);

      createData.thumbnailPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.thumbnailFileName = tyreFile.filename;
    }

    if (tyreModelFile) {
      const folder = path.join(
        "src/assets/car-spares/tyres/model",
        tyreModelFile.filename?.split(".")?.[0]
      );

      fs.mkdirSync(folder, { recursive: true });

      const destination = path.join(folder, tyreModelFile.filename);

      fs.renameSync(tyreModelFile.path, destination);

      createData.modelPath = destination
        .replace(/\\/g, "/")
        .replace(/^src\//, "");

      createData.modelFileName = tyreModelFile.filename;
    }

    let result;

    if (createData.tyreId) {
      if (tyreFile) {
        const tyreData = await Tyres.findById(
          createData.tyreId
        );
        const folder = path.join(
          "src/assets/car-spares/tyres/thumb",
          tyreData.thumbnailFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      if (tyreModelFile) {
        const tyreData = await Tyres.findById(
          createData.tyreId
        );
        const folder = path.join(
          "src/assets/car-spares/tyres/model",
          tyreData.modelFileName?.split(".")?.[0]
        );   
        if (folder) {
          fs.rmSync(folder, { recursive: true, force: true });
        }
      }

      const tyreId = createData?.tyreId;
      delete createData.tyreId;

      result = await Tyres.findByIdAndUpdate(
        tyreId,
        createData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "tyre not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      result = await Tyres.create(createData);

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

exports.updateTyre = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const updated = await Tyres.findByIdAndUpdate(
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

exports.deleteTyre = async (req, res) => {
  try {
    const tyreData = await Tyres.findById(
      req.params.id
    );
    const thumbFolder = path.join("src/assets/car-spares/tyres/thumb", tyreData?.thumbnailFileName?.split(".")?.[0]);   
    if (thumbFolder) {
      fs.rmSync(thumbFolder, { recursive: true, force: true });
    }
    const modelFolder = path.join("src/assets/car-spares/tyres/model", tyreData?.modelFileName?.split(".")?.[0]);   
    if (modelFolder) {
      fs.rmSync(modelFolder, { recursive: true, force: true });
    }

    const deletedTyre =
      await Tyres.findByIdAndDelete(req.params.id);

    if (!deletedTyre) {
      return res.status(404).json({
        success: false,
        message: "Tyre not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tyre deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
