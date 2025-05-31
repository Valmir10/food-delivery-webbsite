// seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const productsData = require("./products.json");

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    console.log("🛠  Kopplar upp mot MongoDB (produktion)...");
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Uppkopplad mot MongoDB.");

    await Product.deleteMany({});
    console.log("🗑  Alla befintliga produkter i produktionen har tagits bort.");

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

    // 3. Bulk‑insert “rensa” arrayen i databasen
    const created = await Product.insertMany(cleanedData);
    console.log(
      `✅ Skapade ${created.length} produkter i produktionsdatabasen:`
    );
    created.forEach((p) => console.log("   •", p.name));

    // 4. Koppla ner
    await mongoose.disconnect();
    console.log("🛑 Kopplade ner från MongoDB. Klart!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Kunde inte köra seed:", err);
    process.exit(1);
  }
}

seed();
