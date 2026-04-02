require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    category: "Interior",
    name: "CapaAcryl Primer - White (20 Ltr)",
    price: 5135,
    description: "Adhesion promoting acrylic primer for use on exterior and interior surfaces."
  },
  {
    category: "Interior",
    name: "CapaAcryl Primer - White (4 Ltr)",
    price: 1195,
    description: "Adhesion promoting acrylic primer for use on exterior and interior surfaces."
  },
  {
    category: "Interior",
    name: "CapaAcryl Primer - White (1 Ltr)",
    price: 355,
    description: "Adhesion promoting acrylic primer for use on exterior and interior surfaces."
  },
  {
    category: "Interior",
    name: "CapaMatt - White/Soft White/Cream (20 Ltr)",
    price: 5475,
    description: "Quality interior matt acrylic co-polymer emulsion paint."
  },
  {
    category: "Interior",
    name: "CapaMatt - White/Soft White/Cream (4 Ltr)",
    price: 1195,
    description: "Quality interior matt acrylic co-polymer emulsion paint."
  },
  {
    category: "Interior",
    name: "CapaMatt - White/Soft White/Cream (1 Ltr)",
    price: 345,
    description: "Quality interior matt acrylic co-polymer emulsion paint."
  },
  {
    category: "Interior",
    name: "CapaFlat - White/Soft White/Cream (20 Ltr)",
    price: 4995,
    description: "Acrylic co-polymer interior paint for walls and ceilings; non-washable."
  },
  {
    category: "Interior",
    name: "CapaFlat - White/Soft White/Cream (4 Ltr)",
    price: 1095,
    description: "Acrylic co-polymer interior paint for walls and ceilings; non-washable."
  },
  {
    category: "Interior",
    name: "CapaFlat - White/Soft White/Cream (1 Ltr)",
    price: 295,
    description: "Acrylic co-polymer interior paint for walls and ceilings; non-washable."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - White/Soft White/Cream (20 Ltr)",
    price: 14895,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - White/Soft White/Cream (4 Ltr)",
    price: 3195,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - White/Soft White/Cream (1 Ltr)",
    price: 995,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - Other Shades (20 Ltr)",
    price: 15995,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - Other Shades (4 Ltr)",
    price: 3375,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaCoat Interior - Other Shades (1 Ltr)",
    price: 1095,
    description: "Superior quality matt interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - White/Soft White/Cream (20 Ltr)",
    price: 16495,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - White/Soft White/Cream (4 Ltr)",
    price: 3295,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - White/Soft White/Cream (1 Ltr)",
    price: 1095,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - Other Shades (20 Ltr)",
    price: 17760,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - Other Shades (4 Ltr)",
    price: 3595,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Silk - Other Shades (1 Ltr)",
    price: 1195,
    description: "Superior quality silk finish interior water-based washable paint."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - White/Soft White/Cream (20 Ltr)",
    price: 19095,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - White/Soft White/Cream (4 Ltr)",
    price: 4015,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - White/Soft White/Cream (1 Ltr)",
    price: 1395,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - Other Shades (20 Ltr)",
    price: 20595,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - Other Shades (4 Ltr)",
    price: 4345,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Matt - Other Shades (1 Ltr)",
    price: 1495,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal matt finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - White/Soft White/Cream (20 Ltr)",
    price: 19295,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - White/Soft White/Cream (4 Ltr)",
    price: 4045,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - White/Soft White/Cream (1 Ltr)",
    price: 1395,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - Other Shades (20 Ltr)",
    price: 20795,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - Other Shades (4 Ltr)",
    price: 4465,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Interior",
    name: "CapaPlus Hygiene Silk - Other Shades (1 Ltr)",
    price: 1495,
    description: "Superior quality pure acrylic anti-bacterial and anti-fungal silk finish."
  },
  {
    category: "Exterior",
    name: "StructurePutz (30KG) - White",
    price: 5795,
    description: "Decorative texture for exterior and interior applications."
  },
  {
    category: "Exterior",
    name: "StructurePutz (5KG) - White",
    price: 1065,
    description: "Decorative texture for exterior and interior applications."
  },
  {
    category: "Exterior",
    name: "Flexotop - White/Soft White/Cream (20 Ltr)",
    price: 19495,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "Flexotop - White/Soft White/Cream (4 Ltr)",
    price: 4095,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "Flexotop - White/Soft White/Cream (1 Ltr)",
    price: 1395,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "Flexotop - Other Shades (20 Ltr)",
    price: 20945,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "Flexotop - Other Shades (4 Ltr)",
    price: 4395,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "Flexotop - Other Shades (1 Ltr)",
    price: 1495,
    description: "100% pure acrylic crack-bridging smooth exterior top coat."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - Tinted (20 Ltr)",
    price: 6695,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - Tinted (4 Ltr)",
    price: 1165,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - White/Soft White/Cream (20 Ltr)",
    price: 19995,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - White/Soft White/Cream (4 Ltr)",
    price: 4195,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - White/Soft White/Cream (1 Ltr)",
    price: 1595,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - Other Shades (20 Ltr)",
    price: 20495,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - Other Shades (4 Ltr)",
    price: 4295,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Exterior",
    name: "FlexoGuard - Other Shades (1 Ltr)",
    price: 1695,
    description:
      "100% pure acrylic crack-bridging anti-carbonation roller-applied smooth textured finish."
  },
  {
    category: "Filler",
    name: "Glomix Trade (25KG) - White",
    price: 895,
    description: "Economy grade interior filler."
  },
  {
    category: "Filler",
    name: "Glomix Premium (25KG) - White",
    price: 1495,
    description: "Premium grade interior and exterior filler."
  },
  {
    category: "Filler",
    name: "CapaStucco (30KG) - White",
    price: 3095,
    description: "Filler for repairs of small defects and cracks."
  }
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in environment");
  }

  await mongoose.connect(process.env.MONGO_URI);

  let created = 0;
  let updated = 0;

  for (const product of products) {
    const existing = await Product.findOne({
      name: product.name,
      category: product.category
    });

    if (existing) {
      existing.price = product.price;
      existing.description = product.description;
      existing.inStock = true;
      if (!existing.imageUrl) existing.imageUrl = "";
      await existing.save();
      updated += 1;
    } else {
      await Product.create({
        ...product,
        imageUrl: "",
        inStock: true
      });
      created += 1;
    }
  }

  console.log(`Import complete. Created: ${created}, Updated: ${updated}, Total rows: ${products.length}`);
};

run()
  .catch((err) => {
    console.error("Import failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
