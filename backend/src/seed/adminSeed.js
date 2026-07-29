import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Admin from '../models/Admin.js';
import connectDB from '../config/database.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

// Seed function - Only creates admin
const seedAdmin = async () => {
  try {
    console.log('🔄 Starting admin seeding...');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    console.log('🔍 Checking for existing admin...');
    const existingAdmin = await Admin.findOne({ 
      $or: [
        { email: 'inez@admin.com' },
        { username: 'admin' }
      ] 
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin already exists. Updating credentials...');
      
      // Update existing admin
      existingAdmin.username = 'admin';
      existingAdmin.email = 'inez@admin.com';
      existingAdmin.password = 'inez@admin.com';
      existingAdmin.fullName = 'Inez Collection';
      existingAdmin.role = 'super-admin';
      existingAdmin.isActive = true;
      
      await existingAdmin.save();
      console.log('✅ Admin updated successfully!');
      console.log('\n📋 Admin Credentials:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Password: admin123`);
      console.log(`   Username: ${existingAdmin.username}`);
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
      const admin = new Admin({
        username: 'admin',
        email: 'inez@admin.com',
        password: 'inez@admin.com',
        fullName: 'Inez Collection',
        role: 'super-admin',
        isActive: true,
      });

      await admin.save();
      console.log('✅ Admin created successfully!');
      console.log('\n📋 Admin Credentials:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123`);
      console.log(`   Username: ${admin.username}`);
    }

    console.log('\n✨ Admin seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();