import { v4 as uuidv4 } from 'uuid';

export const generateGuestId = (req, res, next) => {
  let guestId = req.headers['x-guest-id'] || req.query.guestId || req.body.guestId;

  if (!guestId) {
    guestId = uuidv4();
    req.guestId = guestId;
  } else {
    req.guestId = guestId;
  }

  // Add guestId to response headers
  res.setHeader('X-Guest-ID', req.guestId);
  next();
};