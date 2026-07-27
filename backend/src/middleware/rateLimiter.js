import rateLimit from 'express-rate-limit';

// Contact form rate limiter
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    message: 'Too many contact requests. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Newsletter rate limiter
export const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    success: false,
    message: 'Too many subscription requests. Please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});