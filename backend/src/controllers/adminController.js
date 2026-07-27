import Admin from '../models/Admin.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import Newsletter from '../models/Newsletter.js';
import connectDB from '../config/database.js';
import mongoose from 'mongoose';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Return admin info (without password)
    const adminData = admin.toObject();
    delete adminData.password;

    res.json({
      success: true,
      message: 'Login successful',
      admin: adminData,
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(400).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Public (for demo)
export const getAdminStats = async (req, res) => {
  try {
    console.log('📊 Fetching admin stats...');

    // Ensure database is connected
    const dbConnected = await connectDB();
    if (!dbConnected || mongoose.connection.readyState !== 1) {
      console.error('❌ Database not connected');
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please try again.',
      });
    }

    // Use Promise.allSettled to handle individual failures gracefully
    const results = await Promise.allSettled([
      Product.countDocuments({ isActive: true }).maxTimeMS(5000),
      Order.countDocuments().maxTimeMS(5000),
      Contact.countDocuments().maxTimeMS(5000),
      Newsletter.countDocuments({ isActive: true }).maxTimeMS(5000),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id totalAmount status shippingAddress createdAt')
        .lean()
        .maxTimeMS(5000),
    ]);

    // Extract results with fallbacks
    const [
      productCountResult,
      orderCountResult,
      contactCountResult,
      subscriberCountResult,
      recentOrdersResult,
    ] = results;

    const totalProducts = productCountResult.status === 'fulfilled' ? productCountResult.value : 0;
    const totalOrders = orderCountResult.status === 'fulfilled' ? orderCountResult.value : 0;
    const totalContacts = contactCountResult.status === 'fulfilled' ? contactCountResult.value : 0;
    const totalSubscribers = subscriberCountResult.status === 'fulfilled' ? subscriberCountResult.value : 0;
    const recentOrders = recentOrdersResult.status === 'fulfilled' ? recentOrdersResult.value : [];

    console.log(`📦 Products: ${totalProducts}, Orders: ${totalOrders}, Contacts: ${totalContacts}, Subscribers: ${totalSubscribers}`);

    // Calculate total revenue and orders by status (only if orders query succeeded)
    let totalRevenue = 0;
    let ordersByStatus = {};
    let newContacts = 0;

    if (orderCountResult.status === 'fulfilled') {
      try {
        const revenueData = await Order.aggregate([
          { $match: { status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]).maxTimeMS(5000);
        totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        const statusData = await Order.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]).maxTimeMS(5000);
        ordersByStatus = statusData.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {});
      } catch (aggError) {
        console.warn('⚠️ Aggregation queries failed:', aggError.message);
      }
    }

    if (contactCountResult.status === 'fulfilled') {
      try {
        newContacts = await Contact.countDocuments({ status: 'new' }).maxTimeMS(5000);
      } catch (contactError) {
        console.warn('⚠️ Contact count failed:', contactError.message);
      }
    }

    console.log('✅ Stats fetched successfully');

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalContacts,
        totalSubscribers,
        newContacts,
        newSubscribers: 0,
        ordersByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
      error: error.message,
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Public (for demo)
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error('❌ Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admins',
      error: error.message,
    });
  }
};

// @desc    Create new admin
// @route   POST /api/admin/admins
// @access  Public (for demo)
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email or username already exists',
      });
    }

    const admin = new Admin({
      username,
      email,
      password,
      fullName,
      role: role || 'admin',
    });

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: adminData,
    });
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating admin',
      error: error.message,
    });
  }
};

// @desc    Update admin
// @route   PUT /api/admin/admins/:id
// @access  Public (for demo)
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, isActive } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update fields
    if (username) admin.username = username;
    if (email) admin.email = email;
    if (fullName) admin.fullName = fullName;
    if (role) admin.role = role;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    res.json({
      success: true,
      message: 'Admin updated successfully',
      admin: adminData,
    });
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating admin',
      error: error.message,
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Public (for demo)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Prevent deleting the last admin
    const adminCount = await Admin.countDocuments();
    if (adminCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the last admin account',
      });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting admin:', error);
    res.status(400).json({
      success: false,
      message: 'Error deleting admin',
      error: error.message,
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/admins/:id/password
// @access  Public (for demo)
export const changeAdminPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('❌ Error changing password:', error);
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};