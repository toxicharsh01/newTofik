const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countSchema = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    grams: Number,
    mintPacks : Number,
    normalPacks : Number,
    orderDate: { type: Date, default: Date.now },
});

const Count = mongoose.model('count', countSchema);

module.exports = Count;