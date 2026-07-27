import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

// Sample products data
const sampleProducts = [
  // Dresses
  {
    name: 'Elegant Gold Evening Dress',
    category: 'dresses',
    price: 129.99,
    description: 'Stunning gold evening dress perfect for special occasions. Features a flowing silhouette with delicate gold threading.',
    images: ['dress-gold-1.jpg', 'dress-gold-2.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Gold', 'Black', 'White'],
    stock: 15,
    ratings: [
      {
        guestId: 'guest-1',
        rating: 5,
        comment: 'Absolutely gorgeous dress! The gold color is stunning.',
        createdAt: new Date(),
      },
    ],
    rating: 5,
    isActive: true,
  },
  {
    name: 'Classic Black Cocktail Dress',
    category: 'dresses',
    price: 89.99,
    description: 'Timeless black cocktail dress with a modern twist. Perfect for any formal event.',
    images: ['dress-black-1.jpg', 'dress-black-2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    stock: 20,
    ratings: [
      {
        guestId: 'guest-2',
        rating: 4,
        comment: 'Great quality and fits perfectly!',
        createdAt: new Date(),
      },
    ],
    rating: 4,
    isActive: true,
  },
  {
    name: 'White Lace Summer Dress',
    category: 'dresses',
    price: 79.99,
    description: 'Beautiful white lace dress perfect for summer days. Breathable and elegant.',
    images: ['dress-white-1.jpg', 'dress-white-2.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White'],
    stock: 25,
    rating: 0,
    isActive: true,
  },

  // Wigs
  {
    name: 'Premium Gold Highlight Wig',
    category: 'wigs',
    price: 199.99,
    description: 'Luxury wig with natural-looking gold highlights. Made with 100% human hair.',
    images: ['wig-gold-1.jpg', 'wig-gold-2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Gold', 'Black', 'Brown'],
    stock: 10,
    ratings: [
      {
        guestId: 'guest-3',
        rating: 5,
        comment: 'Best wig I\'ve ever purchased! Looks so natural.',
        createdAt: new Date(),
      },
    ],
    rating: 5,
    isActive: true,
  },
  {
    name: 'Natural Black Curly Wig',
    category: 'wigs',
    price: 149.99,
    description: 'Beautiful natural black curly wig. Perfect for everyday wear.',
    images: ['wig-black-1.jpg', 'wig-black-2.jpg'],
    sizes: ['M', 'L'],
    colors: ['Black'],
    stock: 18,
    rating: 0,
    isActive: true,
  },
  {
    name: 'Blonde Boho Wave Wig',
    category: 'wigs',
    price: 179.99,
    description: 'Trendy blonde boho wave wig. Lightweight and comfortable.',
    images: ['wig-blonde-1.jpg', 'wig-blonde-2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Blonde', 'Gold'],
    stock: 12,
    rating: 0,
    isActive: true,
  },

  // Lip Gloss
  {
    name: 'Gold Shimmer Lip Gloss',
    category: 'lip-gloss',
    price: 24.99,
    description: 'Luxurious lip gloss with gold shimmer. Gives your lips a stunning glow.',
    images: ['lip-gold-1.jpg', 'lip-gold-2.jpg'],
    sizes: [],
    colors: ['Gold'],
    stock: 50,
    ratings: [
      {
        guestId: 'guest-4',
        rating: 5,
        comment: 'Love this gloss! The gold shimmer is perfect.',
        createdAt: new Date(),
      },
    ],
    rating: 5,
    isActive: true,
  },
  {
    name: 'Glossy Pink Lip Gloss',
    category: 'lip-gloss',
    price: 19.99,
    description: 'Hydrating pink lip gloss with a high-shine finish.',
    images: ['lip-pink-1.jpg', 'lip-pink-2.jpg'],
    sizes: [],
    colors: ['Pink'],
    stock: 60,
    rating: 0,
    isActive: true,
  },
  {
    name: 'Clear Crystal Lip Gloss',
    category: 'lip-gloss',
    price: 16.99,
    description: 'Versatile clear lip gloss with crystal-clear shine.',
    images: ['lip-clear-1.jpg', 'lip-clear-2.jpg'],
    sizes: [],
    colors: ['Clear'],
    stock: 70,
    rating: 0,
    isActive: true,
  },

  // Sandals
  {
    name: 'Gold Gladiator Sandals',
    category: 'sandals',
    price: 59.99,
    description: 'Elegant gold gladiator sandals with comfortable padding.',
    images: ['sandals-gold-1.jpg', 'sandals-gold-2.jpg'],
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: ['Gold'],
    stock: 30,
    ratings: [
      {
        guestId: 'guest-5',
        rating: 4,
        comment: 'Comfortable and stylish!',
        createdAt: new Date(),
      },
    ],
    rating: 4,
    isActive: true,
  },
  {
    name: 'Black Strappy Sandals',
    category: 'sandals',
    price: 49.99,
    description: 'Classic black strappy sandals with a low block heel.',
    images: ['sandals-black-1.jpg', 'sandals-black-2.jpg'],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Black'],
    stock: 35,
    rating: 0,
    isActive: true,
  },
  {
    name: 'White Platform Sandals',
    category: 'sandals',
    price: 69.99,
    description: 'Trendy white platform sandals with a chunky sole.',
    images: ['sandals-white-1.jpg', 'sandals-white-2.jpg'],
    sizes: ['37', '38', '39', '40'],
    colors: ['White'],
    stock: 20,
    rating: 0,
    isActive: true,
  },

  // Slippers
  {
    name: 'Luxury Gold Velvet Slippers',
    category: 'slippers',
    price: 39.99,
    description: 'Ultra-comfortable gold velvet slippers with memory foam.',
    images: ['slippers-gold-1.jpg', 'slippers-gold-2.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gold'],
    stock: 40,
    ratings: [
      {
        guestId: 'guest-6',
        rating: 5,
        comment: 'So comfortable! The velvet is so soft.',
        createdAt: new Date(),
      },
    ],
    rating: 5,
    isActive: true,
  },
  {
    name: 'Classic Black Memory Foam Slippers',
    category: 'slippers',
    price: 29.99,
    description: 'Comfortable black slippers with memory foam insole.',
    images: ['slippers-black-1.jpg', 'slippers-black-2.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    stock: 45,
    rating: 0,
    isActive: true,
  },
  {
    name: 'White Plush Slippers',
    category: 'slippers',
    price: 34.99,
    description: 'Plush white slippers with non-slip sole and soft lining.',
    images: ['slippers-white-1.jpg', 'slippers-white-2.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    stock: 38,
    rating: 0,
    isActive: true,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🔄 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Admin.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new Admin({
      username: 'admin',
      email: 'admin@ecommerce.com',
      password: 'Admin123!',
      fullName: 'Store Administrator',
      role: 'super-admin',
      isActive: true,
    });

    await admin.save();
    console.log('✅ Admin user created:');
    console.log('   Email: admin@ecommerce.com');
    console.log('   Password: Admin123!');

    // Insert products
    console.log('📦 Inserting products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} products seeded successfully`);

    // Log product categories
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = 0;
      }
      categories[product.category]++;
    });

    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} products`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();