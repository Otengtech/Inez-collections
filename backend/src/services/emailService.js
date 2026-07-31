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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f5f5f5;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #EDF1EC;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        /* Header - matching HeroSection style */
        .header {
          background: #ffffff;
          padding: 40px 30px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #D6F04C;
          border-radius: 2px;
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
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 14px;
          margin-top: 6px;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        /* Content - matching card style */
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .greeting strong {
          color: #1a1a1a;
        }
        .thank-you {
          color: #666;
          font-size: 15px;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        /* Order Card - matching white card with shadow */
        .order-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 25px;
          margin: 25px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .order-card h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
          letter-spacing: -0.3px;
        }
        /* Order meta grid */
        .order-meta {
          display: table;
          width: 100%;
          margin-bottom: 20px;
          border-collapse: separate;
          border-spacing: 8px;
        }
        .order-meta-item {
          display: table-cell;
          background: #f8f9f6;
          padding: 12px 15px;
          border-radius: 12px;
          width: 50%;
        }
        .order-meta-item .label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          color: #999;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .order-meta-item .value {
          display: block;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 3px;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          background: #D6F04C;
          color: #1a1a1a;
          padding: 3px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        /* Items section */
        .items-section {
          margin: 20px 0;
        }
        .items-section h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        .item {
          display: table;
          width: 100%;
          background: #f8f9f6;
          padding: 12px;
          border-radius: 16px;
          margin-bottom: 10px;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .item-image {
          display: table-cell;
          width: 64px;
          height: 64px;
          vertical-align: middle;
          background: #EDF1EC;
          border-radius: 12px;
          text-align: center;
          overflow: hidden;
        }
        .item-image img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 12px;
        }
        .item-image-placeholder {
          font-size: 28px;
          line-height: 64px;
          color: #bbb;
        }
        .item-details {
          display: table-cell;
          vertical-align: middle;
          padding-left: 14px;
        }
        .item-details .name {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
          display: block;
        }
        .item-details .meta {
          font-size: 12px;
          color: #888;
          display: block;
          margin-top: 2px;
        }
        .item-details .price {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
          display: block;
          margin-top: 4px;
        }
        /* Totals */
        .totals {
          background: #f8f9f6;
          padding: 18px 20px;
          border-radius: 16px;
          margin: 15px 0;
        }
        .total-row {
          display: table;
          width: 100%;
          padding: 6px 0;
          font-size: 14px;
          color: #555;
        }
        .total-row .label {
          display: table-cell;
          text-align: left;
        }
        .total-row .amount {
          display: table-cell;
          text-align: right;
          font-weight: 500;
        }
        .total-row.grand-total {
          border-top: 2px solid #e0e3dd;
          padding-top: 14px;
          margin-top: 6px;
          font-size: 17px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .total-row.grand-total .amount {
          color: #1a1a1a;
        }
        /* Address section - matching card style */
        .address-section {
          margin: 25px 0;
          padding: 20px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .address-section h4 {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }
        .address-section p {
          color: #555;
          line-height: 1.8;
          font-size: 14px;
          margin: 0;
        }
        /* Button - matching the CTA style */
        .button-container {
          text-align: center;
          margin: 30px 0 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
        }
        .button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        .support-text {
          color: #888;
          font-size: 14px;
          text-align: center;
          margin-top: 20px;
          line-height: 1.6;
        }
        /* Footer - matching the hero footer style */
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
          line-height: 1.6;
        }
        .footer .email-note {
          font-size: 11px;
          color: #bbb;
        }
        /* Responsive */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px 25px;
          }
          .header h1 {
            font-size: 24px;
          }
          .order-meta {
            display: block;
            border-spacing: 0;
          }
          .order-meta-item {
            display: block;
            width: 100%;
            margin-bottom: 8px;
          }
          .item {
            display: block;
          }
          .item-image {
            display: inline-block;
            width: 60px;
            height: 60px;
            vertical-align: middle;
          }
          .item-image img {
            width: 60px;
            height: 60px;
          }
          .item-details {
            display: inline-block;
            padding-left: 12px;
            vertical-align: middle;
            width: calc(100% - 80px);
          }
          .button {
            padding: 12px 30px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
        }
        @media (max-width: 400px) {
          .item {
            text-align: center;
          }
          .item-image {
            display: block;
            margin: 0 auto 10px;
          }
          .item-details {
            display: block;
            padding-left: 0;
            width: 100%;
          }
          .order-meta-item {
            padding: 10px;
          }
        }
        /* Outlook and email client fixes */
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header - matching the HeroSection style -->
        <div class="header">
          <div class="header-logo">I</div>
          <h1>Order Confirmed! ✨</h1>
          <div class="subtitle">Thank you for your purchase</div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Dear <strong>${order.shippingAddress.fullName}</strong>,
          </div>
          <p class="thank-you">
            Thank you for your order! We're excited to let you know that we've received your order and are processing it.
          </p>
          
          <!-- Order Card - matching white card with rounded corners -->
          <div class="order-card">
            <h3>📋 Order Summary</h3>
            
            <!-- Order Meta Grid -->
            <table class="order-meta" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="order-meta-item" width="50%" style="background:#f8f9f6;padding:12px 15px;border-radius:12px;">
                  <span class="label">Order ID</span>
                  <span class="value">#${order._id}</span>
                </td>
                <td class="order-meta-item" width="50%" style="background:#f8f9f6;padding:12px 15px;border-radius:12px;">
                  <span class="label">Date</span>
                  <span class="value">${new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</span>
                </td>
              </tr>
              <tr>
                <td class="order-meta-item" width="50%" style="background:#f8f9f6;padding:12px 15px;border-radius:12px;">
                  <span class="label">Status</span>
                  <span class="value">
                    <span class="status-badge" style="background:#D6F04C;color:#1a1a1a;padding:3px 14px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;">${order.status}</span>
                  </span>
                </td>
                <td class="order-meta-item" width="50%" style="background:#f8f9f6;padding:12px 15px;border-radius:12px;">
                  <span class="label">Payment</span>
                  <span class="value">${order.paymentMethod || 'Credit Card'}</span>
                </td>
              </tr>
            </table>

            <!-- Items -->
            <div class="items-section">
              <h4>🛍️ Items Ordered</h4>
              ${order.items.map(item => `
                <div class="item" style="background:#f8f9f6;padding:12px;border-radius:16px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.02);">
                  <div class="item-image" style="display:table-cell;width:64px;height:64px;vertical-align:middle;background:#EDF1EC;border-radius:12px;text-align:center;overflow:hidden;">
                    ${item.image ?
        `<img src="${item.image}" alt="${item.name}" style="width:64px;height:64px;object-fit:cover;border-radius:12px;" />` :
        `<span class="item-image-placeholder" style="font-size:28px;line-height:64px;color:#bbb;">📦</span>`
      }
                  </div>
                  <div class="item-details" style="display:table-cell;vertical-align:middle;padding-left:14px;">
                    <span class="name" style="font-weight:600;color:#1a1a1a;font-size:14px;display:block;">${item.name}</span>
                    <span class="meta" style="font-size:12px;color:#888;display:block;margin-top:2px;">
                      ${item.size ? `Size: ${item.size}` : ''}
                      ${item.color ? ` • Color: ${item.color}` : ''}
                      ${item.quantity ? ` • Qty: ${item.quantity}` : ''}
                    </span>
                    <span class="price" style="font-weight:600;color:#1a1a1a;font-size:14px;display:block;margin-top:4px;">$${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Totals -->
            <div class="totals" style="background:#f8f9f6;padding:18px 20px;border-radius:16px;margin:15px 0;">
              <div class="total-row" style="display:table;width:100%;padding:6px 0;font-size:14px;color:#555;">
                <span class="label" style="display:table-cell;text-align:left;">Subtotal</span>
                <span class="amount" style="display:table-cell;text-align:right;font-weight:500;">$${order.totalAmount.toFixed(2)}</span>
              </div>
              ${order.shippingCost ? `
                <div class="total-row" style="display:table;width:100%;padding:6px 0;font-size:14px;color:#555;">
                  <span class="label" style="display:table-cell;text-align:left;">Shipping</span>
                  <span class="amount" style="display:table-cell;text-align:right;font-weight:500;">$${order.shippingCost.toFixed(2)}</span>
                </div>
              ` : ''}
              ${order.tax ? `
                <div class="total-row" style="display:table;width:100%;padding:6px 0;font-size:14px;color:#555;">
                  <span class="label" style="display:table-cell;text-align:left;">Tax</span>
                  <span class="amount" style="display:table-cell;text-align:right;font-weight:500;">$${order.tax.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="total-row grand-total" style="display:table;width:100%;padding:6px 0;font-size:14px;color:#555;border-top:2px solid #e0e3dd;padding-top:14px;margin-top:6px;font-size:17px;font-weight:700;color:#1a1a1a;">
                <span class="label" style="display:table-cell;text-align:left;">Total</span>
                <span class="amount" style="display:table-cell;text-align:right;font-weight:500;color:#1a1a1a;">$${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="address-section" style="margin:25px 0;padding:20px;background:#ffffff;border-radius:20px;border:1px solid rgba(0,0,0,0.03);box-shadow:0 4px 20px rgba(0,0,0,0.02);">
            <h4 style="font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:10px;letter-spacing:-0.3px;">📍 Shipping Address</h4>
            <p style="color:#555;line-height:1.8;font-size:14px;margin:0;">
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              📞 ${order.shippingAddress.phone}
            </p>
          </div>

          <!-- CTA Button -->
          <div class="button-container" style="text-align:center;margin:30px 0 20px;">
            <a href="${process.env.CLIENT_URL}/orders/${order._id}?guestId=${guestId}" class="button" style="display:inline-block;padding:14px 40px;background:#1a1a1a;color:#D6F04C;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;border:2px solid #1a1a1a;">
              Track Your Order →
            </a>
          </div>

          <p class="support-text" style="color:#888;font-size:14px;text-align:center;margin-top:20px;line-height:1.6;">
            💬 If you have any questions, feel free to reply to this email or contact our support team.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer" style="background:#ffffff;padding:30px;text-align:center;border-top:1px solid rgba(0,0,0,0.04);">
          <div class="brand" style="display:inline-block;background:#D6F04C;color:#1a1a1a;padding:4px 16px;border-radius:20px;font-weight:700;font-size:14px;margin-bottom:10px;">✨ Inez</div>
          <p style="font-size:12px;color:#999;margin:5px 0;line-height:1.6;">&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
          <p class="email-note" style="font-size:11px;color:#bbb;margin:5px 0;line-height:1.6;">
            This email was sent to ${order.shippingAddress.email}
          </p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f5f5f5;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #EDF1EC;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        /* Header - matching HeroSection style */
        .header {
          background: #ffffff;
          padding: 40px 30px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #D6F04C;
          border-radius: 2px;
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
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 14px;
          margin-top: 6px;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        /* Content */
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 8px;
        }
        .greeting strong {
          color: #1a1a1a;
        }
        .update-message {
          color: #666;
          font-size: 15px;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        /* Status Card - matching white card style */
        .status-card {
          background: #ffffff;
          border-radius: 28px;
          padding: 30px;
          text-align: center;
          margin: 25px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .status-icon {
          font-size: 48px;
          margin-bottom: 12px;
          display: block;
        }
        .status-label {
          font-size: 12px;
          text-transform: uppercase;
          color: #999;
          letter-spacing: 0.5px;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }
        .status-value {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 5px 0;
        }
        .status-badge {
          display: inline-block;
          background: #D6F04C;
          color: #1a1a1a;
          padding: 6px 24px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .order-id {
          color: #888;
          font-size: 14px;
          margin-top: 12px;
          display: block;
        }
        /* Timeline - matching clean style */
        .status-timeline {
          margin: 30px 0;
          padding: 0;
          background: #ffffff;
          border-radius: 20px;
          padding: 20px 24px;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .timeline-item {
          display: table;
          width: 100%;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .timeline-item:last-child {
          border-bottom: none;
        }
        .timeline-dot {
          display: table-cell;
          width: 12px;
          vertical-align: middle;
          padding-right: 15px;
        }
        .timeline-dot .dot {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e8e8e8;
        }
        .timeline-dot .dot.completed {
          background: #4CAF50;
        }
        .timeline-dot .dot.active {
          background: #D6F04C;
          box-shadow: 0 0 0 4px rgba(214, 240, 76, 0.2);
        }
        .timeline-content {
          display: table-cell;
          vertical-align: middle;
          padding-left: 5px;
        }
        .timeline-content .label {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 14px;
          display: block;
        }
        .timeline-content .date {
          font-size: 12px;
          color: #999;
          display: block;
          margin-top: 2px;
        }
        /* Button - matching CTA style */
        .button-container {
          text-align: center;
          margin: 30px 0 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
        }
        .button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        .support-text {
          color: #888;
          font-size: 14px;
          text-align: center;
          margin-top: 20px;
          line-height: 1.6;
        }
        /* Footer */
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
          line-height: 1.6;
        }
        /* Responsive */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px 25px;
          }
          .header h1 {
            font-size: 24px;
          }
          .status-value {
            font-size: 24px;
          }
          .status-card {
            padding: 20px;
          }
          .status-timeline {
            padding: 15px 18px;
          }
          .button {
            padding: 12px 30px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
          .timeline-item {
            padding: 10px 0;
          }
          .timeline-dot {
            padding-right: 12px;
          }
        }
        @media (max-width: 400px) {
          .status-badge {
            font-size: 14px;
            padding: 5px 18px;
          }
          .status-icon {
            font-size: 36px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header - matching HeroSection style -->
        <div class="header">
          <div class="header-logo">I</div>
          <h1>📦 Order Status Update</h1>
          <div class="subtitle">Your order has been updated</div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Dear <strong>${order.shippingAddress.fullName}</strong>,
          </div>
          <p class="update-message">
            We wanted to let you know that there's been an update on your order.
          </p>
          
          <!-- Status Card -->
          <div class="status-card">
            <span class="status-icon">🔄</span>
            <span class="status-label">Current Status</span>
            <div class="status-value">
              <span class="status-badge">${status}</span>
            </div>
            <span class="order-id">Order #${order._id}</span>
          </div>

          <!-- Timeline -->
          <div class="status-timeline">
            <div class="timeline-item">
              <div class="timeline-dot">
                <span class="dot ${['pending', 'processing', 'shipped', 'delivered'].includes(status) ? 'completed' : 'active'}"></span>
              </div>
              <div class="timeline-content">
                <span class="label">Order Placed</span>
                <span class="date">${new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot">
                <span class="dot ${['processing', 'shipped', 'delivered'].includes(status) ? 'completed' : status === 'pending' ? '' : 'active'}"></span>
              </div>
              <div class="timeline-content">
                <span class="label">Processing</span>
                <span class="date">${['processing', 'shipped', 'delivered'].includes(status) ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot">
                <span class="dot ${['shipped', 'delivered'].includes(status) ? 'completed' : status === 'shipped' ? 'active' : ''}"></span>
              </div>
              <div class="timeline-content">
                <span class="label">Shipped</span>
                <span class="date">${['shipped', 'delivered'].includes(status) ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot">
                <span class="dot ${status === 'delivered' ? 'completed' : ''}"></span>
              </div>
              <div class="timeline-content">
                <span class="label">Delivered</span>
                <span class="date">${status === 'delivered' ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="button-container">
            <a href="${process.env.CLIENT_URL}/orders/${order._id}?guestId=${order.guestId}" class="button">
              View Full Order Details →
            </a>
          </div>

          <p class="support-text">
            💬 Need help? Reply to this email or contact our support team.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="brand">✨ Inez</div>
          <p>&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f5f5f5;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #EDF1EC;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        /* Header - matching HeroSection style */
        .header {
          background: #ffffff;
          padding: 40px 30px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #D6F04C;
          border-radius: 2px;
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
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 14px;
          margin-top: 6px;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        /* Content */
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .greeting strong {
          color: #1a1a1a;
        }
        .welcome-message {
          color: #666;
          font-size: 15px;
          margin-bottom: 25px;
          line-height: 1.7;
        }
        /* Benefits Card */
        .benefits-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 25px;
          margin: 20px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .benefits-card h3 {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li .icon {
          font-size: 18px;
          width: 30px;
          display: inline-block;
          text-align: center;
        }
        /* CTA Button - matching hero style */
        .button-container {
          text-align: center;
          margin: 25px 0 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
        }
        .button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        /* Unsubscribe note */
        .unsubscribe-note {
          background: #f8f9f6;
          border-radius: 16px;
          padding: 15px 20px;
          margin: 20px 0;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.03);
        }
        .unsubscribe-note p {
          color: #888;
          font-size: 13px;
          margin: 0;
          line-height: 1.6;
        }
        .unsubscribe-note a {
          color: #1a1a1a;
          text-decoration: underline;
          font-weight: 500;
        }
        .unsubscribe-note a:hover {
          color: #D6F04C;
        }
        .heart-message {
          text-align: center;
          font-size: 16px;
          color: #1a1a1a;
          margin-top: 20px;
          font-weight: 500;
        }
        /* Footer */
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
          line-height: 1.6;
        }
        .footer .email-note {
          font-size: 11px;
          color: #bbb;
        }
        .footer .unsubscribe-link {
          color: #999;
          text-decoration: underline;
          font-size: 11px;
        }
        .footer .unsubscribe-link:hover {
          color: #D6F04C;
        }
        /* Responsive */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px 25px;
          }
          .header h1 {
            font-size: 24px;
          }
          .button {
            padding: 12px 30px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
          .benefits-list li {
            font-size: 13px;
            padding: 8px 0;
          }
          .benefits-list li .icon {
            width: 24px;
            font-size: 16px;
          }
        }
        @media (max-width: 400px) {
          .benefits-list li {
            flex-wrap: wrap;
          }
          .benefits-list li .icon {
            width: 20px;
          }
        }
        /* Outlook fixes */
        .benefits-list li {
          display: block;
          padding: 8px 0;
        }
        .benefits-list li .icon {
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header - matching HeroSection style -->
        <div class="header">
          <div class="header-logo">I</div>
          <h1>Welcome to Our Community! 🎉</h1>
          <div class="subtitle">You're now part of the family</div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Hello <strong>${email}</strong>! 👋
          </div>
          
          <p class="welcome-message">
            Thank you for subscribing to our newsletter! We're thrilled to have you on board.
            Get ready for exclusive updates, special offers, and fashion inspiration delivered straight to your inbox.
          </p>
          
          <!-- Benefits Card -->
          <div class="benefits-card">
            <h3>✨ What You'll Receive</h3>
            <ul class="benefits-list">
              <li>
                <span class="icon">✨</span>
                <span><strong>New Product Arrivals</strong> — Be the first to know about our latest collections</span>
              </li>
              <li>
                <span class="icon">💎</span>
                <span><strong>Special Discounts</strong> — Exclusive subscriber-only promotions</span>
              </li>
              <li>
                <span class="icon">🎨</span>
                <span><strong>Fashion Tips</strong> — Style inspiration and trend guides</span>
              </li>
              <li>
                <span class="icon">🎁</span>
                <span><strong>Member-Only Offers</strong> — Early access to sales and events</span>
              </li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div class="button-container">
            <a href="${process.env.CLIENT_URL || '#'}/products" class="button">
              🛍️ Shop Our Collection →
            </a>
          </div>

          <!-- Unsubscribe Note -->
          <div class="unsubscribe-note">
            <p>
              You can unsubscribe at any time by clicking the link at the bottom of our emails.
              We respect your privacy and will never share your information.
            </p>
          </div>

          <div class="heart-message">
            Happy shopping! ❤️
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="brand">✨ Inez</div>
          <p>&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
          <p class="email-note">This email was sent to ${email}</p>
          <p>
            <a href="${process.env.CLIENT_URL || '#'}/unsubscribe?email=${email}" class="unsubscribe-link">
              Unsubscribe from newsletter
            </a>
          </p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f5f5f5;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #EDF1EC;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        /* Header - matching HeroSection style */
        .header {
          background: #ffffff;
          padding: 40px 30px 30px;
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: #D6F04C;
          border-radius: 2px;
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
          color: #1a1a1a;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header .subtitle {
          color: #666;
          font-size: 14px;
          margin-top: 6px;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        /* Content */
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          font-weight: 500;
          color: #1a1a1a;
          margin-bottom: 10px;
        }
        .greeting strong {
          color: #1a1a1a;
        }
        .thank-you-message {
          color: #666;
          font-size: 15px;
          margin-bottom: 25px;
          line-height: 1.7;
        }
        /* Info Cards */
        .info-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 25px;
          margin: 20px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .info-card h3 {
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .info-list li {
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .info-list li:last-child {
          border-bottom: none;
        }
        .info-list li .icon {
          font-size: 18px;
          width: 30px;
          display: inline-block;
        }
        /* Social Links */
        .social-section {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
        }
        .social-section p {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .social-links {
          display: table;
          width: 100%;
          border-collapse: separate;
          border-spacing: 10px 0;
        }
        .social-links .social-cell {
          display: table-cell;
          text-align: center;
          width: 50%;
        }
        .social-button {
          display: inline-block;
          padding: 10px 20px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 13px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .social-button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        .social-button.instagram {
          background: #E4405F;
          border-color: #E4405F;
          color: #ffffff;
        }
        .social-button.instagram:hover {
          background: #c13584;
          border-color: #c13584;
        }
        .social-button.snapchat {
          background: #FFFC00;
          border-color: #FFFC00;
          color: #1a1a1a;
        }
        .social-button.snapchat:hover {
          background: #e6e300;
          border-color: #e6e300;
        }
        /* CTA Button */
        .button-container {
          text-align: center;
          margin: 25px 0 20px;
        }
        .button {
          display: inline-block;
          padding: 14px 40px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 15px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
        }
        .button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        .support-text {
          color: #888;
          font-size: 14px;
          text-align: center;
          margin-top: 20px;
          line-height: 1.6;
        }
        .heart-message {
          text-align: center;
          font-size: 16px;
          color: #1a1a1a;
          margin-top: 20px;
          font-weight: 500;
        }
        /* Footer */
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
          line-height: 1.6;
        }
        .footer .email-note {
          font-size: 11px;
          color: #bbb;
        }
        /* Responsive */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px 25px;
          }
          .header h1 {
            font-size: 24px;
          }
          .social-links {
            display: block;
            border-spacing: 0;
          }
          .social-links .social-cell {
            display: block;
            width: 100%;
            margin-bottom: 10px;
          }
          .social-button {
            width: 100%;
          }
          .button {
            padding: 12px 30px;
            font-size: 14px;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }
          .info-list li {
            font-size: 13px;
            padding: 8px 0;
          }
        }
        @media (max-width: 400px) {
          .info-list li {
            flex-wrap: wrap;
          }
          .info-list li .icon {
            width: 24px;
          }
        }
        /* Outlook fixes */
        .info-list li {
          display: block;
          padding: 8px 0;
        }
        .info-list li .icon {
          margin-right: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header - matching HeroSection style -->
        <div class="header">
          <div class="header-logo">I</div>
          <h1>Thank You for Reaching Out! 💬</h1>
          <div class="subtitle">We're here to help</div>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="greeting">
            Dear <strong>${name}</strong>,
          </div>
          
          <p class="thank-you-message">
            Thank you for contacting us! We've received your message and will get back to you within 24-48 hours.
          </p>
          
          <!-- Quick Links Card -->
          <div class="info-card">
            <h3>📌 Helpful Resources</h3>
            <ul class="info-list">
              <li>
                <span class="icon">📚</span>
                <span>Visit our FAQ section for quick answers</span>
              </li>
              <li>
                <span class="icon">📦</span>
                <span>Check shipping and delivery information</span>
              </li>
              <li>
                <span class="icon">🔄</span>
                <span>Review our return and exchange policy</span>
              </li>
            </ul>
          </div>

          <!-- Social Section -->
          <div class="social-section">
            <p>📱 Connect with us on social media for faster responses</p>
            <div class="social-links">
              <div class="social-cell">
                <a href="https://instagram.com/maame_esi67" target="_blank" class="social-button instagram">
                  📸 Instagram
                </a>
              </div>
              <div class="social-cell">
                <a href="https://snapchat.com/add/eee_nez" target="_blank" class="social-button snapchat">
                  👻 Snapchat
                </a>
              </div>
            </div>
          </div>

          <!-- Shop CTA -->
          <div class="button-container">
            <a href="${process.env.CLIENT_URL || '#'}/products" class="button">
              🛍️ Shop Our Collection →
            </a>
          </div>

          <p class="support-text">
            💡 If your query is urgent, you can also reach us through our social media channels.
          </p>

          <div class="heart-message">
            We appreciate your interest in our store! ❤️
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="brand">✨ Inez</div>
          <p>&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
          <p class="email-note">This email was sent to ${email}</p>
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
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #f5f5f5;
          padding: 20px;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #EDF1EC;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
        }
        /* Header - Admin style with dark background */
        .header {
          background: #1a1a1a;
          padding: 40px 30px 30px;
          text-align: center;
          border-bottom: 4px solid #D6F04C;
          position: relative;
        }
        .header-badge {
          display: inline-block;
          background: #D6F04C;
          color: #1a1a1a;
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }
        .header h1 {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .header .subtitle {
          color: #D6F04C;
          font-size: 14px;
          margin-top: 6px;
          letter-spacing: 0.5px;
          font-weight: 400;
        }
        .header .order-id-top {
          color: #888;
          font-size: 13px;
          margin-top: 10px;
          display: block;
          font-weight: 400;
        }
        /* Content */
        .content {
          padding: 30px;
        }
        /* Alert Banner */
        .alert-banner {
          background: #D6F04C;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 25px;
          text-align: center;
        }
        .alert-banner .alert-text {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 15px;
        }
        .alert-banner .alert-sub {
          font-size: 13px;
          color: #1a1a1a;
          opacity: 0.8;
          margin-top: 2px;
        }
        /* Quick Action Bar */
        .quick-actions {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
          display: table;
          width: 100%;
          border-collapse: separate;
          border-spacing: 10px 0;
        }
        .quick-actions .action-cell {
          display: table-cell;
          text-align: center;
          padding: 8px 0;
          width: 33.33%;
        }
        .quick-actions .action-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f8f9f6;
          border-radius: 50px;
          text-decoration: none;
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        .quick-actions .action-link:hover {
          background: #D6F04C;
          border-color: #D6F04C;
        }
        .quick-actions .action-link .icon {
          font-size: 16px;
        }
        .quick-actions .action-link.phone-link {
          background: #e8f5e9;
        }
        .quick-actions .action-link.phone-link:hover {
          background: #D6F04C;
        }
        .quick-actions .action-link.email-link {
          background: #e3f2fd;
        }
        .quick-actions .action-link.email-link:hover {
          background: #D6F04C;
        }
        .quick-actions .action-link.whatsapp-link {
          background: #e8f5e9;
        }
        .quick-actions .action-link.whatsapp-link:hover {
          background: #25D366;
          color: #ffffff;
          border-color: #25D366;
        }
        /* Customer Info Card */
        .customer-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .customer-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        .customer-grid {
          display: table;
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px;
        }
        .customer-row {
          display: table-row;
        }
        .customer-label {
          display: table-cell;
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          font-weight: 600;
          padding-right: 15px;
          width: 30%;
          vertical-align: top;
          padding-bottom: 4px;
        }
        .customer-value {
          display: table-cell;
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 500;
          vertical-align: top;
          padding-bottom: 4px;
          word-break: break-word;
        }
        .customer-value a {
          color: #1a1a1a;
          text-decoration: none;
          border-bottom: 1px dashed #D6F04C;
          transition: all 0.3s ease;
        }
        .customer-value a:hover {
          color: #D6F04C;
          border-bottom-color: #1a1a1a;
        }
        .customer-value .phone-link {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .customer-value .phone-link:hover {
          color: #25D366;
        }
        .customer-value .email-link {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 600;
        }
        .customer-value .email-link:hover {
          color: #1a73e8;
        }
        /* Order Items Card */
        .items-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .items-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -0.3px;
        }
        .items-header {
          display: table;
          width: 100%;
          padding: 8px 0 10px;
          border-bottom: 2px solid #f0f0f0;
          margin-bottom: 10px;
        }
        .items-header .col {
          display: table-cell;
          font-size: 11px;
          text-transform: uppercase;
          color: #999;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .items-header .col-product {
          width: 50%;
        }
        .items-header .col-qty {
          width: 20%;
          text-align: center;
        }
        .items-header .col-price {
          width: 30%;
          text-align: right;
        }
        .item-row {
          display: table;
          width: 100%;
          padding: 10px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .item-row:last-child {
          border-bottom: none;
        }
        .item-row .col {
          display: table-cell;
          vertical-align: middle;
          font-size: 14px;
          color: #1a1a1a;
        }
        .item-row .col-product {
          width: 50%;
        }
        .item-row .col-product .name {
          font-weight: 500;
          display: block;
        }
        .item-row .col-product .meta {
          font-size: 12px;
          color: #888;
          display: block;
          margin-top: 2px;
        }
        .item-row .col-qty {
          width: 20%;
          text-align: center;
          font-weight: 500;
        }
        .item-row .col-price {
          width: 30%;
          text-align: right;
          font-weight: 600;
        }
        /* Totals */
        .totals-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .total-row {
          display: table;
          width: 100%;
          padding: 6px 0;
          font-size: 14px;
          color: #555;
        }
        .total-row .label {
          display: table-cell;
          text-align: left;
        }
        .total-row .amount {
          display: table-cell;
          text-align: right;
          font-weight: 500;
        }
        .total-row.grand-total {
          border-top: 2px solid #e0e3dd;
          padding-top: 14px;
          margin-top: 6px;
          font-size: 17px;
          font-weight: 700;
          color: #1a1a1a;
        }
        .total-row.grand-total .amount {
          color: #1a1a1a;
        }
        /* Shipping Address */
        .address-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 25px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .address-card h3 {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .address-card p {
          color: #555;
          line-height: 1.8;
          font-size: 14px;
          margin: 0;
        }
        /* Admin Action Buttons */
        .button-container {
          text-align: center;
          margin: 25px 0 20px;
        }
        .button-group {
          display: table;
          width: 100%;
          border-collapse: separate;
          border-spacing: 10px 0;
        }
        .button-group .button-cell {
          display: table-cell;
          width: 50%;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: #1a1a1a;
          color: #D6F04C;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid #1a1a1a;
          transition: all 0.3s ease;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        }
        .button:hover {
          background: #D6F04C;
          color: #1a1a1a;
          border-color: #D6F04C;
        }
        .button-secondary {
          background: transparent;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
        }
        .button-secondary:hover {
          background: #1a1a1a;
          color: #D6F04C;
          border-color: #1a1a1a;
        }
        .support-text {
          color: #888;
          font-size: 13px;
          text-align: center;
          margin-top: 20px;
          line-height: 1.6;
        }
        /* Footer */
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
          line-height: 1.6;
        }
        .footer .admin-note {
          font-size: 11px;
          color: #bbb;
          margin-top: 8px;
        }
        /* Responsive */
        @media (max-width: 480px) {
          body {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px 25px;
          }
          .header h1 {
            font-size: 24px;
          }
          .customer-label {
            width: 40%;
            font-size: 11px;
          }
          .customer-value {
            font-size: 13px;
          }
          .items-header .col {
            font-size: 10px;
          }
          .item-row .col {
            font-size: 13px;
          }
          .item-row .col-product {
            width: 45%;
          }
          .item-row .col-qty {
            width: 15%;
          }
          .item-row .col-price {
            width: 40%;
          }
          .button-group {
            display: block;
            border-spacing: 0;
          }
          .button-group .button-cell {
            display: block;
            width: 100%;
            margin-bottom: 10px;
          }
          .button {
            width: 100%;
            padding: 12px 20px;
            font-size: 13px;
          }
          .alert-banner {
            padding: 14px 16px;
          }
          .alert-banner .alert-text {
            font-size: 14px;
          }
          .quick-actions {
            display: block;
            border-spacing: 0;
          }
          .quick-actions .action-cell {
            display: block;
            width: 100%;
            margin-bottom: 8px;
          }
          .quick-actions .action-link {
            display: flex;
            justify-content: center;
            width: 100%;
          }
        }
        @media (max-width: 400px) {
          .customer-label {
            display: block;
            width: 100%;
            padding-bottom: 2px;
          }
          .customer-value {
            display: block;
            width: 100%;
            padding-bottom: 8px;
          }
          .customer-row {
            display: block;
          }
          .item-row {
            display: block;
            padding: 12px 0;
          }
          .item-row .col {
            display: block;
            width: 100% !important;
            text-align: left !important;
          }
          .item-row .col-qty {
            margin-top: 4px;
            text-align: left !important;
          }
          .item-row .col-price {
            margin-top: 4px;
            text-align: left !important;
          }
          .items-header {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header - Admin style -->
        <div class="header">
          <div class="header-badge">🔔 Admin Alert</div>
          <h1>New Order Received</h1>
          <div class="subtitle">Action Required</div>
          <span class="order-id-top">Order #${order._id}</span>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- Alert Banner -->
          <div class="alert-banner">
            <div class="alert-text">A new order has been placed!</div>
            <div class="alert-sub">Please review and process this order</div>
          </div>

          <!-- Quick Action Bar - Contact Customer -->
          <div class="quick-actions">
            <div class="action-cell">
              <a href="tel:${order.shippingAddress.phone}" class="action-link phone-link">
                <span class="icon">📞</span>
                Call Customer
              </a>
            </div>
            <div class="action-cell">
              <a href="mailto:${order.shippingAddress.email}?subject=Order%20#${order._id}%20-%20Customer%20Support" class="action-link email-link">
                <span class="icon">✉️</span>
                Email Customer
              </a>
            </div>
            <div class="action-cell">
  <a 
    href="https://wa.me/233${order.shippingAddress.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.shippingAddress.fullName}, I'm reaching out regarding your order #${order._id}`)}"
    target="_blank"
    class="action-link whatsapp-link"
  >
    <span class="icon">💬</span>
    WhatsApp
  </a>
</div>
          </div>

          <!-- Customer Information -->
          <div class="customer-card">
            <h3>👤 Customer Information</h3>
            <div class="customer-grid">
              <div class="customer-row">
                <span class="customer-label">Full Name</span>
                <span class="customer-value">${order.shippingAddress.fullName}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">Email</span>
                <span class="customer-value">
                  <a href="mailto:${order.shippingAddress.email}?subject=Order%20#${order._id}%20-%20Customer%20Support" class="email-link">
                    ${order.shippingAddress.email}
                  </a>
                </span>
              </div>
              <div class="customer-row">
                <span class="customer-label">Phone</span>
                <span class="customer-value">
                  <a href="tel:${order.shippingAddress.phone}" class="phone-link">
                    📞 ${order.shippingAddress.phone}
                  </a>
                  <span style="font-size:12px;color:#999;margin-left:8px;">
                    <a href="https://wa.me/233${order.shippingAddress.phone.replace(/^0/, '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.shippingAddress.fullName}, I'm reaching out regarding your order #${order._id}`)}" target="_blank" style="text-decoration:none;color:#25D366;font-weight:500;">💬 WhatsApp</a>
                  </span>
                </span>
              </div>
              <div class="customer-row">
                <span class="customer-label">Payment</span>
                <span class="customer-value">${order.paymentMethod || 'Credit Card'}</span>
              </div>
              <div class="customer-row">
                <span class="customer-label">Order Date</span>
                <span class="customer-value">${new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="items-card">
            <h3>🛍️ Order Items</h3>
            <div class="items-header">
              <span class="col col-product">Product</span>
              <span class="col col-qty">Qty</span>
              <span class="col col-price">Total</span>
            </div>
            ${order.items.map(item => `
              <div class="item-row">
                <span class="col col-product">
                  <span class="name">${item.name}</span>
                  <span class="meta">
                    ${item.size ? `Size: ${item.size}` : ''}
                    ${item.color ? ` • Color: ${item.color}` : ''}
                  </span>
                </span>
                <span class="col col-qty">${item.quantity}</span>
                <span class="col col-price">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Totals -->
          <div class="totals-card">
            <div class="total-row">
              <span class="label">Subtotal</span>
              <span class="amount">$${order.totalAmount.toFixed(2)}</span>
            </div>
            ${order.shippingCost ? `
              <div class="total-row">
                <span class="label">Shipping</span>
                <span class="amount">$${order.shippingCost.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.tax ? `
              <div class="total-row">
                <span class="label">Tax</span>
                <span class="amount">$${order.tax.toFixed(2)}</span>
              </div>
            ` : ''}
            ${order.discount ? `
              <div class="total-row">
                <span class="label">Discount</span>
                <span class="amount">-$${order.discount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span class="label">Total</span>
              <span class="amount">$${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="address-card">
            <h3>📍 Shipping Address</h3>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}<br>
              📞 <a href="tel:${order.shippingAddress.phone}" style="color:#1a1a1a;text-decoration:none;border-bottom:1px dashed #D6F04C;">${order.shippingAddress.phone}</a>
            </p>
          </div>

          <!-- Admin Actions -->
          <div class="button-container">
            <div class="button-group">
              <div class="button-cell">
                <a href="${process.env.ADMIN_URL || '#'}/orders/${order._id}" class="button">
                  📋 View Order
                </a>
              </div>
              <div class="button-cell">
                <a href="${process.env.ADMIN_URL || '#'}/orders/${order._id}/edit" class="button button-secondary">
                  ✏️ Process Order
                </a>
              </div>
            </div>
          </div>

          <p class="support-text">
            ⚡ This is an automated notification for store administrators.<br>
            Please take necessary action to fulfill this order.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="brand">✨ Inez Admin</div>
          <p>&copy; ${new Date().getFullYear()} Inez. All rights reserved.</p>
          <p class="admin-note">This is an automated admin notification.</p>
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