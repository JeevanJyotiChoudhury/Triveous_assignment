const mongoose = require("mongoose");

const productDetailsSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    images: [String],
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        rating: Number,
      },
    ],
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        text: String,
      },
    ],
  },
  {
    versionKey: false,
  }
);

const ProductDetailsModel = mongoose.model(
  "productDetails",
  productDetailsSchema
);

module.exports = {
  ProductDetailsModel,
};
