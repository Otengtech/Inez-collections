import Contact from '../models/Contact.js';
import { sendContactAutoReply } from '../services/emailService.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create contact entry
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      status: 'new',
    });

    await contact.save();

    // Send auto-reply
    await sendContactAutoReply(name, email);

    // Notify admin (optional)
    // await sendAdminContactNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Public (for demo)
export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const skip = (page - 1) * limit;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    res.json({
      success: true,
      contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Public (for demo)
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    // Mark as read if it was new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message,
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Public (for demo)
export const updateContactStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    contact.status = status;
    if (status === 'replied' || status === 'resolved') {
      contact.repliedAt = new Date();
    }
    if (notes) {
      contact.notes = notes;
    }

    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message,
    });
  }
};

// @desc    Reply to contact (send email)
// @route   POST /api/contact/:id/reply
// @access  Public (for demo)
export const replyToContact = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
    }

    // Send reply email
    const emailResult = await sendEmail(
      contact.email,
      `Re: ${contact.subject}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Response to Your Inquiry</h2>
          <p>Dear ${contact.name},</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #C9A84C; margin: 15px 0;">
            <p>${replyMessage}</p>
          </div>
          <p>Best regards,<br>Your E-Commerce Store Team</p>
          <hr>
          <p style="font-size: 12px; color: #888;">
            Original message: ${contact.message.substring(0, 200)}...
          </p>
        </div>
      `
    );

    if (!emailResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to send reply email',
        error: emailResult.error,
      });
    }

    // Update contact status
    contact.status = 'replied';
    contact.repliedAt = new Date();
    await contact.save();

    res.json({
      success: true,
      message: 'Reply sent successfully',
      contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error sending reply',
      error: error.message,
    });
  }
};