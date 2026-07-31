import Newsletter from '../models/Newsletter.js';
import { sendNewsletterWelcome } from '../services/emailService.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    let subscription = await Newsletter.findOne({ email });

    if (subscription) {
      if (subscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed'
        });
      } else {
        subscription.isActive = true;
        subscription.unsubscribeAt = null;
        await subscription.save();
        
        await sendNewsletterWelcome(email);

        return res.json({
          success: true,
          message: 'Successfully re-subscribed',
          subscription,
        });
      }
    }

    subscription = new Newsletter({ email });
    await subscription.save();

    await sendNewsletterWelcome(email);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed!',
      subscription,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed',
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || 'Error subscribing',
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscription = await Newsletter.findOne({ email });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    subscription.isActive = false;
    subscription.unsubscribeAt = new Date();
    await subscription.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error unsubscribing',
      error: error.message,
    });
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter/subscribers
// @access  Public (for demo)
export const getSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 50, isActive } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const [subscribers, total] = await Promise.all([
      Newsletter.find(filter)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Newsletter.countDocuments(filter),
    ]);

    res.json({
      success: true,
      subscribers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message,
    });
  }
};

// @desc    Send bulk newsletter
// @route   POST /api/newsletter/send
// @access  Public (for demo)
export const sendBulkNewsletter = async (req, res) => {
  try {
    const { subject, content, testEmail } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subject and content are required',
      });
    }

    const subscribers = await Newsletter.find({ isActive: true });

    if (subscribers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active subscribers found',
      });
    }

    // In development, just log the emails
    console.log(`📧 Sending newsletter to ${subscribers.length} subscribers`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content.substring(0, 200)}...`);

    res.json({
      success: true,
      message: `Newsletter would be sent to ${subscribers.length} subscribers (development mode)`,
      stats: {
        total: subscribers.length,
        sent: subscribers.length,
        failed: 0,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending newsletter',
      error: error.message,
    });
  }
};

// controllers/newsletterController.js

// @desc    Delete subscriber (admin only)
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findById(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found',
      });
    }

    await Newsletter.findByIdAndDelete(id);

    console.log(`🗑️ Subscriber ${id} (${subscriber.email}) deleted successfully`);

    res.json({
      success: true,
      message: 'Subscriber deleted successfully',
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscriber',
      error: error.message,
    });
  }
};

// @desc    Delete multiple subscribers (admin only)
// @route   DELETE /api/newsletter/bulk-delete
// @access  Private/Admin
export const bulkDeleteSubscribers = async (req, res) => {
  try {
    const { subscriberIds } = req.body;

    if (!subscriberIds || !subscriberIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subscriber IDs to delete',
      });
    }

    // Check if subscribers exist
    const subscribers = await Newsletter.find({ _id: { $in: subscriberIds } });

    if (!subscribers.length) {
      return res.status(404).json({
        success: false,
        message: 'No subscribers found to delete',
      });
    }

    // Delete all subscribers
    const result = await Newsletter.deleteMany({ _id: { $in: subscriberIds } });

    console.log(`🗑️ ${result.deletedCount} subscribers deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} subscriber(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk delete subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscribers',
      error: error.message,
    });
  }
};

// @desc    Delete all inactive subscribers (admin only)
// @route   DELETE /api/newsletter/delete-inactive
// @access  Private/Admin
export const deleteInactiveSubscribers = async (req, res) => {
  try {
    const result = await Newsletter.deleteMany({ isActive: false });

    console.log(`🗑️ ${result.deletedCount} inactive subscribers deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} inactive subscriber(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete inactive subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting inactive subscribers',
      error: error.message,
    });
  }
};

// @desc    Delete all subscribers (admin only - use with caution)
// @route   DELETE /api/newsletter/delete-all
// @access  Private/Admin
export const deleteAllSubscribers = async (req, res) => {
  try {
    const { confirm } = req.query;

    // Safety check - require confirmation
    if (confirm !== 'true') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm deletion by adding ?confirm=true to the request',
      });
    }

    const result = await Newsletter.deleteMany({});

    console.log(`🗑️ ${result.deletedCount} all subscribers deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} subscriber(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete all subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting subscribers',
      error: error.message,
    });
  }
};