require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const filter = {
    $or: [
      { name: /glomix/i },
      { name: /capastucco/i },
      { name: /filler/i }
    ]
  };

  const result = await Product.updateMany(filter, {
    $set: { category: "Filler", subcategory: "" }
  });

  console.log(
    `Filler migration complete. Matched: ${result.matchedCount}, Updated: ${result.modifiedCount}`
  );
};

run()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
