const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // availablePacks: {
  //   type: Number,
  // },
});

module.exports = mongoose.model("Product", productSchema);
