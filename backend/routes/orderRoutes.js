const express = require("express");
const {
  createOrder,
  listUserOrders,
  listAllOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", authRequired, createOrder);
router.get("/mine", authRequired, listUserOrders);

router.get("/admin/all", authRequired, requireRole("admin"), listAllOrders);
router.patch("/admin/:id", authRequired, requireRole("admin"), updateOrderStatus);

module.exports = router;
