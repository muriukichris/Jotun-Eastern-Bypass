const path = require("path");
const express = require("express");
const multer = require("multer");
const { authRequired, requireRole } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  return cb(new Error("Only image uploads are allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

router.post("/", authRequired, requireRole("admin"), upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  return res.status(201).json({ url });
});

module.exports = router;
