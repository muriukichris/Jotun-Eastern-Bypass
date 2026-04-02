const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }
  await mongoose.connect(MONGO_URI);
};

module.exports = connectDB;
