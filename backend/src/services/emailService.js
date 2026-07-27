import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using Gmail service directly
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service directly
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Timeouts for better reliability
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

// Create transporter instance
let transporter;
let emailConfigured = false;

const initTransporter = () => {
  try {
    transporter = createTransporter();
    emailConfigured = true;
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    emailConfigured = false;
    return null;
  }
};

initTransporter();

// Verify connection with retry logic
const verifyConnection = async (retries = 3) => {
  if (!transporter) {
    console.log('⚠️  No email transporter available');
    return false;
  }

  for (let i = 0; i < retries; i++) {
    try {
      await transporter.verify();
      console.log('✅ Email server is ready to send messages');
      emailConfigured = true;
      return true;
    } catch (error) {
      console.error(`❌ Email verification attempt ${i + 1} failed:`, error.message);
      emailConfigured = false;
      
      // Wait before retrying
      if (i < retries - 1) {
        console.log(`🔄 Retrying in 2 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Recreate transporter for next attempt
        transporter = createTransporter();
      }
    }
  }
  
  console.log('⚠️  Email service will work in fallback mode (emails will be logged)');
  return false;
};

// Run verification
verifyConnection();

// Send email function with fallback
export const sendEmail = async (to, subject, html, from = process.env.EMAIL_FROM) => {
  try {
    // Check if email is configured
    if (!emailConfigured || !transporter) {
      console.log('📧 [FALLBACK] Email would have been sent to:', to);
      console.log(`Subject: ${subject}`);
      console.log('HTML preview:', html.substring(0, 200) + '...');
      return { 
        success: true, 
        messageId: 'fallback-mode',
        message: 'Email logged (fallback mode)'
      };
    }

    const mailOptions = {
      from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    // Fallback - log the email
    console.log('📧 [FALLBACK] Email would have been sent to:', to);
    console.log(`Subject: ${subject}`);
    console.log('HTML preview:', html.substring(0, 200) + '...');
    
    return { 
      success: true, 
      messageId: 'fallback-error',
      message: 'Email logged (error fallback)'
    };
  }
};

// Email templates
export const emailTemplates = {
  orderConfirmation: (order, guestId) => ({
    subject: `Order Confirmation #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #C9A84C); padding: 20px; text-align: center; }
          .header h1 { color: #000; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-size: 20px; font-weight: bold; color: #C9A84C; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
          .button { display: inline-block; padding: 10px 20px; background: #000; color: #FFD700; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${order.shippingAddress.fullName},</p>
            <p>Thank you for your order! We're excited to let you know that we've received your order and are processing it.</p>
            
            <div class="order-details">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span style="color: #C9A84C;">${order.status}</span></p>
              
              <h4>Items:</h4>
              ${order.items.map(item => `
                <div class="item">
                  <p><strong>${item.name}</strong> x ${item.quantity}</p>
                  <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                  ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                  ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                </div>
              `).join('')}
              
              <p class="total">Total: $${order.totalAmount.toFixed(2)}</p>
            </div>

            <div>
              <h4>Shipping Address:</h4>
              <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.address}<br>
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
                ${order.shippingAddress.country}<br>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <p>You can track your order status using this link:</p>
            <p>
              <a href="${process.env.CLIENT_URL}/orders/${order._id}?guestId=${guestId}" class="button">
                Track Your Order
              </a>
            </p>

            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            <p>Thank you for shopping with us! ❤️</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your E-Commerce Store. All rights reserved.</p>
            <p>This email was sent to ${order.shippingAddress.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  orderStatusUpdate: (order, status) => ({
    subject: `Order #${order._id} Status Update: ${status}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #C9A84C); padding: 20px; text-align: center; }
          .header h1 { color: #000; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .status-box { background: #fff; padding: 20px; border-radius: 5px; text-align: center; margin: 15px 0; }
          .status { font-size: 24px; font-weight: bold; color: #C9A84C; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Status Updated</h1>
          </div>
          <div class="content">
            <p>Dear ${order.shippingAddress.fullName},</p>
            <p>Your order status has been updated.</p>
            
            <div class="status-box">
              <h3>Current Status</h3>
              <p class="status">${status.toUpperCase()}</p>
              <p>Order ID: ${order._id}</p>
            </div>

            <p>Track your order:</p>
            <p>
              <a href="${process.env.CLIENT_URL}/orders/${order._id}?guestId=${order.guestId}" class="button">
                View Order Details
              </a>
            </p>

            <p>Thank you for choosing us! ❤️</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your E-Commerce Store</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  newsletterWelcome: (email) => ({
    subject: 'Welcome to Our Newsletter! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #C9A84C); padding: 20px; text-align: center; }
          .header h1 { color: #000; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
          .button { display: inline-block; padding: 10px 20px; background: #000; color: #FFD700; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Our Community!</h1>
          </div>
          <div class="content">
            <h2>Hello!</h2>
            <p>Thank you for subscribing to our newsletter!</p>
            <p>You'll now receive exclusive updates about:</p>
            <ul>
              <li>✨ New product arrivals</li>
              <li>💎 Special discounts and promotions</li>
              <li>🎨 Fashion tips and trends</li>
              <li>🎁 Exclusive member-only offers</li>
            </ul>

            <p>Check out our latest collection:</p>
            <p>
              <a href="${process.env.CLIENT_URL}/products" class="button">
                Shop Now
              </a>
            </p>

            <p>You can unsubscribe at any time by clicking the link at the bottom of our emails.</p>
            <p>Happy shopping! ❤️</p>
          </div>
          <div class="footer">
            <p>${email}</p>
            <p>&copy; ${new Date().getFullYear()} Your E-Commerce Store</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  contactAutoReply: (name, email) => ({
    subject: 'Thank You for Contacting Us! 💬',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FFD700, #C9A84C); padding: 20px; text-align: center; }
          .header h1 { color: #000; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Thank You for Reaching Out!</h1>
          </div>
          <div class="content">
            <h2>Dear ${name},</h2>
            <p>Thank you for contacting us! We've received your message and will get back to you within 24-48 hours.</p>
            
            <p>In the meantime, you might find answers to common questions in our:</p>
            <ul>
              <li>📚 FAQ section</li>
              <li>📦 Shipping and delivery information</li>
              <li>🔄 Return and exchange policy</li>
            </ul>

            <p>If your query is urgent, you can also reach us through our social media channels.</p>
            <p>We appreciate your interest in our store! ❤️</p>
          </div>
          <div class="footer">
            <p>${email}</p>
            <p>&copy; ${new Date().getFullYear()} Your E-Commerce Store</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminOrderNotification: (order) => ({
    subject: `🛒 New Order #${order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; padding: 20px; text-align: center; }
          .header h1 { color: #FFD700; margin: 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .total { font-size: 20px; font-weight: bold; color: #000; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛒 New Order Received</h1>
          </div>
          <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Customer:</strong> ${order.shippingAddress.fullName}</p>
              <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
              <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
              <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
              
              <h4>Items:</h4>
              ${order.items.map(item => `
                <div>
                  <p>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</p>
                  ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                  ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                </div>
              `).join('')}
            </div>
            
            <p><a href="${process.env.ADMIN_URL || '#'}" class="button">View in Admin</a></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Admin Notification</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Email functions
export const sendOrderConfirmation = async (order, guestId) => {
  const template = emailTemplates.orderConfirmation(order, guestId);
  return await sendEmail(
    order.shippingAddress.email,
    template.subject,
    template.html
  );
};

export const sendOrderStatusUpdate = async (order, status) => {
  const template = emailTemplates.orderStatusUpdate(order, status);
  return await sendEmail(
    order.shippingAddress.email,
    template.subject,
    template.html
  );
};

export const sendNewsletterWelcome = async (email) => {
  const template = emailTemplates.newsletterWelcome(email);
  return await sendEmail(email, template.subject, template.html);
};

export const sendContactAutoReply = async (name, email) => {
  const template = emailTemplates.contactAutoReply(name, email);
  return await sendEmail(email, template.subject, template.html);
};

export const sendAdminOrderNotification = async (order) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  if (!adminEmail) {
    console.log('⚠️  No admin email configured');
    return { success: false, error: 'No admin email' };
  }
  const template = emailTemplates.adminOrderNotification(order);
  return await sendEmail(adminEmail, template.subject, template.html);
};

export default {
  sendEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendNewsletterWelcome,
  sendContactAutoReply,
  sendAdminOrderNotification,
};