const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { items } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(products.map((p) => [String(p._id), p]));
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 1);
      if (!product || quantity < 1) {
        return res.status(400).json({ message: "Invalid product or quantity" });
      }
      orderItems.push({ product: product._id, quantity, price: product.price });
      total += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total
    });

    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create order" });
  }
};

const listUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load orders" });
  }
};

const listAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: "Failed to load orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
  const { status, adminNote } = req.body || {};
  const allowed = ["pending", "confirmed", "ready", "completed", "cancelled"];

  if (status && !allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const update = {};
  if (status) update.status = status;
  if (typeof adminNote === "string") update.adminNote = adminNote;

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update order" });
  }
};

module.exports = { createOrder, listUserOrders, listAllOrders, updateOrderStatus };
