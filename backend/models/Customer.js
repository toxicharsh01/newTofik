const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },

    fixedRates: [
      {
        productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        gramsPerPack: {
          type: Number,
          required: true,
        }, // 50 grams
        ratePerPack: { type: Number, required: true }, // 18 rs
      },
    ],
  },
  {
    timestamps: true, // createdAt aur updatedAt automatically
  },
);

module.exports = mongoose.model("Customer", customerSchema);
