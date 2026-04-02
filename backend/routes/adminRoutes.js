const express = require("express");
const { authRequired, requireRole } = require("../middleware/auth");
const { listUsers, updateUser, analytics } = require("../controllers/adminController");

const router = express.Router();

router.get("/users", authRequired, requireRole("admin"), listUsers);
router.patch("/users/:id", authRequired, requireRole("admin"), updateUser);
router.get("/analytics", authRequired, requireRole("admin"), analytics);

module.exports = router;
