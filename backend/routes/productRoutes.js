const express = require("express");
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", listProducts);
router.post("/", authRequired, requireRole("admin"), createProduct);
router.patch("/:id", authRequired, requireRole("admin"), updateProduct);
router.delete("/:id", authRequired, requireRole("admin"), deleteProduct);

module.exports = router;
