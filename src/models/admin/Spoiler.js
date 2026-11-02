const mongoose = require("mongoose");

const SpoilerSchema = new mongoose.Schema(
  {
    spoilerName: {
      type: String,
      required: true,
    },
    thumbnailPath: {
      type: String,
      required: false,
      default: "",
    },
    thumbnailFileName: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    cost: {
      type: String,
      required: false,
      default: "",
    },
    modelPath: {
      type: String,
      required: false,
      default: "",
    },
    modelFileName: {
      type: String,
      required: false,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("spoilers", SpoilerSchema);
