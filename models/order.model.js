const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      
    },
  ],
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
