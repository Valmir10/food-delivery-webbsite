// seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const productsData = require("./products.json");

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    console.log("🛠  connecting to MongoDB (production)...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB.");

    await Product.deleteMany({});
    console.log("🗑  All products deleted.");

    const cleanedData = productsData.map((prod) => {
      return {
        // Bara de fält din modell kräver:
        name: prod.name,
        description: prod.description,
        price: prod.price,
        imageUrl: prod.imageUrl,
        category: prod.category,
        rating: prod.rating,
      };
    });

    const created = await Product.insertMany(cleanedData);
    console.log(`✅ Skapade ${created.length} products in product database:`);
    created.forEach((p) => console.log("   •", p.name));

    // 4. Koppla ner
    await mongoose.disconnect();
    console.log("🛑 connected from MongoDB. Klart!");
    process.exit(0);
  } catch (err) {
    console.error("❌ could not run seed:", err);
    process.exit(1);
  }
}

seed();
