const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  orderDate: { type: Date, default: Date.now },
  isOrdered : {type: Boolean, default: true},
  isCompleted: {type: Boolean, default: false},
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      packs: { type: Number, required: true }, // 20, 10, 0.5
      ratePerPack: { type: Number }, // Auto
      totalAmount: { type: Number }, // Auto
    },
  ],  

});

module.exports = mongoose.model("Order", orderSchema);
