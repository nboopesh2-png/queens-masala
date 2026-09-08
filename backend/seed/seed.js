require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/queens-masala';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');

  // clear collections
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  // create categories
  const categories = [
    { name: 'Cooking Masala', slug: 'cooking-masala' },
    { name: 'Spice Powders', slug: 'spice-powders' },
    { name: 'Traditional Masala', slug: 'traditional-masala' },
    { name: 'Combo Packs', slug: 'combo-packs' },
    { name: 'Special Products', slug: 'special-products' }
  ];

  const createdCats = await Category.insertMany(categories);

  // create admin
  const salt = await bcrypt.genSalt(10);
  const admin = new User({
    name: 'Queens Admin',
    email: 'admin@queensmasala.com',
    password: await bcrypt.hash('Admin@123', salt),
    role: 'admin',
    phone: '9999999999'
  });
  await admin.save();

  // sample products
  const sampleProducts = [
    {
      name: "Queens Chicken Masala",
      slug: 'queens-chicken-masala',
      description: 'A robust blend for authentic chicken dishes. Homemade, aromatic and perfectly balanced.',
      ingredients: 'Coriander, Cumin, Red Chilli, Turmeric, Garam Masala, Salt',
      usage: 'Use 1-2 tsp per 500g meat while cooking.',
      storage: 'Store in a cool, dry place.',
      shelfLife: '12 months',
      weights: ['50g', '100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[0]._id,
      mrp: 150,
      price: 120,
      discountPercentage: 20
    },
    {
      name: "Queens Mutton Masala",
      slug: 'queens-mutton-masala',
      description: 'Traditional mutton masala for rich gravies and authentic taste.',
      ingredients: 'Coriander, Cumin, Clove, Cinnamon, Black Pepper, Salt',
      usage: 'Use 1-2 tsp per 500g meat while cooking.',
      storage: 'Store in a cool, dry place.',
      shelfLife: '12 months',
      weights: ['50g', '100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[0]._id,
      mrp: 160,
      price: 130,
      discountPercentage: 18
    },
    {
      name: "Queens Sambar Powder",
      slug: 'queens-sambar-powder',
      description: 'Authentic South Indian sambar powder with roasted spices.',
      ingredients: 'Toor Dal, Coriander, Red Chilli, Curry Leaves, Fenugreek',
      usage: 'Add 2 tbsp to 1L sambar as needed.',
      storage: 'Store in airtight container.',
      shelfLife: '10 months',
      weights: ['100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 120,
      price: 100,
      discountPercentage: 16
    },
    {
      name: "Queens Rasam Powder",
      slug: 'queens-rasam-powder',
      description: 'Zesty rasam powder for tangy soups and broths.',
      ingredients: 'Coriander, Black Pepper, Cumin, Dry Red Chilli',
      usage: 'Add 1-2 tsp per bowl of rasam.',
      storage: 'Keep away from moisture.',
      shelfLife: '10 months',
      weights: ['100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 110,
      price: 90,
      discountPercentage: 18
    },
    {
      name: "Queens Garam Masala",
      slug: 'queens-garam-masala',
      description: 'Premium garam masala made from hand-roasted whole spices.',
      ingredients: 'Cinnamon, Clove, Cardamom, Nutmeg, Mace',
      usage: 'Sprinkle a pinch towards the end of cooking.',
      storage: 'Airtight jar recommended.',
      shelfLife: '18 months',
      weights: ['50g', '100g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[2]._id,
      mrp: 180,
      price: 150,
      discountPercentage: 17
    },
    {
      name: "Queens Curry Masala",
      slug: 'queens-curry-masala',
      description: 'Rich curry masala for gravies and soups.',
      ingredients: 'Coriander, Turmeric, Red Chilli, Fenugreek',
      usage: 'Use 1-2 tsp per 500g of vegetables/meat.',
      storage: 'Keep in cool place.',
      shelfLife: '12 months',
      weights: ['50g', '100g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[2]._id,
      mrp: 140,
      price: 115,
      discountPercentage: 18
    },
    {
      name: "Queens Turmeric Powder",
      slug: 'queens-turmeric-powder',
      description: 'Bright and pure turmeric powder sourced from trusted farms.',
      ingredients: 'Turmeric',
      usage: 'Use as per recipe.',
      storage: 'Airtight container.',
      shelfLife: '24 months',
      weights: ['100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 90,
      price: 75,
      discountPercentage: 16
    },
    {
      name: "Queens Chilli Powder",
      slug: 'queens-chilli-powder',
      description: 'Spicy and vibrant chilli powder for authentic heat.',
      ingredients: 'Red Chilli',
      usage: 'Adjust quantity as per spice tolerance.',
      storage: 'Keep dry.',
      shelfLife: '12 months',
      weights: ['100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 80,
      price: 65,
      discountPercentage: 18
    },
    {
      name: "Queens Coriander Powder",
      slug: 'queens-coriander-powder',
      description: 'Freshly milled coriander powder for balanced flavour.',
      ingredients: 'Coriander Seeds',
      usage: 'Use in gravies and marinades.',
      storage: 'Airtight container.',
      shelfLife: '12 months',
      weights: ['100g', '200g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 80,
      price: 66,
      discountPercentage: 17
    },
    {
      name: "Queens Pepper Powder",
      slug: 'queens-pepper-powder',
      slug2: 'queens-pepper',
      description: 'Fresh black pepper powder for aromatic heat.',
      ingredients: 'Black Pepper',
      usage: 'Use as required.',
      storage: 'Dry place.',
      shelfLife: '18 months',
      weights: ['50g', '100g'],
      images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
      category: createdCats[1]._id,
      mrp: 120,
      price: 95,
      discountPercentage: 21
    }
  ];

  await Product.insertMany(sampleProducts);

  console.log('Seed data created.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
