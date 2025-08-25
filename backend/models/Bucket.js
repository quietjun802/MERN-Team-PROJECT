const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },   // ✅ 통일
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bucket", bucketSchema);
