const Product = require("../models/Product");

const listProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load products" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, inStock, category, subcategory } = req.body || {};

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const allowedCategories = ["Interior", "Exterior", "Colorants", "Filler", "Made to order"];
    const normalizedCategory = category || "Interior";
    if (!allowedCategories.includes(normalizedCategory)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const normalizedSubcategory =
      normalizedCategory === "Made to order" ? subcategory || "" : "";
    if (normalizedCategory === "Made to order" && !normalizedSubcategory) {
      return res.status(400).json({ message: "Subcategory is required for made to order" });
    }

    const product = await Product.create({
      name,
      description: description || "",
      price,
      imageUrl: imageUrl || "",
      inStock: inStock !== undefined ? inStock : true,
      category: normalizedCategory,
      subcategory: normalizedSubcategory
    });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...(req.body || {}) };
    if (update.category && update.category !== "Made to order") {
      update.subcategory = "";
    }
    if (update.category === "Made to order" && !update.subcategory) {
      return res.status(400).json({ message: "Subcategory is required for made to order" });
    }
    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };
