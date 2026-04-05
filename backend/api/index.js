require("dotenv").config();
const app = require("../app");
const connectDB = require("../db");

let dbReadyPromise = null;

module.exports = async (req, res) => {
  if (!dbReadyPromise) {
    dbReadyPromise = connectDB().catch((err) => {
      dbReadyPromise = null;
      throw err;
    });
  }

  try {
    await dbReadyPromise;
    return app(req, res);
  } catch (err) {
    return res.status(500).json({ message: "Database connection failed" });
  }
};
