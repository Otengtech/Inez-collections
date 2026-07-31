// controllers/contactController.js
import Contact from '../models/Contact.js';
import { sendContactAutoReply, sendEmail } from '../services/emailService.js';

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
    
    // Validate inputs
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required',
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    console.log('📧 Sending reply to:', contact.email);
    console.log('Reply message:', replyMessage);

    // Format email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #EDF1EC;
            border-radius: 40px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.06);
          }
          .header {
            background: #1a1a1a;
            padding: 40px 30px 30px;
            text-align: center;
            border-bottom: 4px solid #D6F04C;
          }
          .header-logo {
            display: inline-block;
            background: #D6F04C;
            color: #1a1a1a;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            line-height: 56px;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
          }
          .header .subtitle {
            color: #D6F04C;
            font-size: 14px;
            margin-top: 6px;
          }
          .content {
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 10px;
          }
          .message-box {
            background: #ffffff;
            border-radius: 20px;
            padding: 25px;
            margin: 20px 0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            border-left: 4px solid #D6F04C;
          }
          .message-box p {
            color: #333;
            line-height: 1.8;
            font-size: 15px;
          }
          .original-message {
            background: #f8f9f6;
            border-radius: 16px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid rgba(0,0,0,0.03);
          }
          .original-message h4 {
            font-size: 13px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 10px;
          }
          .original-message p {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
          }
          .footer {
            background: #ffffff;
            padding: 30px;
            text-align: center;
            border-top: 1px solid rgba(0,0,0,0.04);
          }
          .footer .brand {
            display: inline-block;
            background: #D6F04C;
            color: #1a1a1a;
            padding: 4px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .footer p {
            font-size: 12px;
            color: #999;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-logo">I</div>
            <h1>Response to Your Inquiry</h1>
            <div class="subtitle">We're here to help</div>
          </div>
          
          <div class="content">
            <div class="greeting">
              Dear ${contact.name || 'Customer'},
            </div>
            
            <p style="color: #666; margin-bottom: 20px;">
              Thank you for reaching out to us. Here's our response to your inquiry:
            </p>
            
            <div class="message-box">
              <p>${replyMessage}</p>
            </div>
            
            <div class="original-message">
              <h4>📝 Your Original Message</h4>
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p style="margin-top: 8px;">${contact.message}</p>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 20px;">
              If you have any further questions, please don't hesitate to reply to this email.
            </p>
            
            <p style="color: #1a1a1a; font-weight: 500; margin-top: 20px;">
              Best regards,<br>
              <span style="color: #D6F04C;">The Inez Team</span>
            </p>
          </div>

          <div class="footer">
            <div class="brand">✨ Inez</div>
            <p>&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send reply email using the imported sendEmail function
    console.log(`📧 Sending reply to ${contact.email}...`);
    const emailResult = await sendEmail(
      contact.email,
      `Re: ${contact.subject}`,
      emailHtml
    );

    console.log('Email result:', emailResult);

    // Update contact status
    contact.status = 'replied';
    contact.repliedAt = new Date();
    await contact.save();

    res.json({
      success: true,
      message: emailResult.isFallback 
        ? 'Reply saved but email was logged (email service not configured)' 
        : 'Reply sent successfully',
      contact,
      emailStatus: emailResult,
    });

  } catch (error) {
    console.error('❌ Reply error:', error);
    res.status(400).json({
      success: false,
      message: 'Error sending reply',
      error: error.message,
    });
  }
};

// controllers/contactController.js

// @desc    Delete contact message (admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
      });
    }

    await Contact.findByIdAndDelete(id);

    console.log(`🗑️ Contact message ${id} deleted successfully`);

    res.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact message',
      error: error.message,
    });
  }
};

// @desc    Delete multiple contact messages (admin only)
// @route   DELETE /api/contact/bulk-delete
// @access  Private/Admin
export const bulkDeleteContacts = async (req, res) => {
  try {
    const { contactIds } = req.body;

    if (!contactIds || !contactIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide contact IDs to delete',
      });
    }

    // Check if contacts exist
    const contacts = await Contact.find({ _id: { $in: contactIds } });

    if (!contacts.length) {
      return res.status(404).json({
        success: false,
        message: 'No contact messages found to delete',
      });
    }

    // Delete all contacts
    const result = await Contact.deleteMany({ _id: { $in: contactIds } });

    console.log(`🗑️ ${result.deletedCount} contact messages deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} contact message(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Bulk delete contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact messages',
      error: error.message,
    });
  }
};

// @desc    Delete all contact messages (admin only)
// @route   DELETE /api/contact/delete-all
// @access  Private/Admin
export const deleteAllContacts = async (req, res) => {
  try {
    const { status } = req.query; // Optional: delete only specific status

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const result = await Contact.deleteMany(filter);

    console.log(`🗑️ ${result.deletedCount} contact messages deleted successfully`);

    res.json({
      success: true,
      message: `${result.deletedCount} contact message(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Delete all contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact messages',
      error: error.message,
    });
  }
};