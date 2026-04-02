const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  imageUrl: { type: String, default: "" },
  inStock: { type: Boolean, default: true },
  category: {
    type: String,
    enum: ["Interior", "Exterior", "Colorants", "Filler", "Made to order"],
    default: "Interior"
  },
  subcategory: { type: String, default: "" },
  color: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
