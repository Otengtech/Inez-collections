// This is a simple in-memory notification store for demo
// In production, you would store these in a database

let notifications = [];

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Public (demo)
export const getNotifications = async (req, res) => {
  try {
    res.json({
      success: true,
      notifications: notifications.slice(0, 50) // Last 50 notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Public (demo)
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = notifications.find(n => n.id === id);
    
    if (notification) {
      notification.read = true;
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Public (demo)
export const markAllNotificationsRead = async (req, res) => {
  try {
    notifications = notifications.map(n => ({ ...n, read: true }));
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notifications'
    });
  }
};

// Helper function to add notification (used by other controllers)
export const addNotification = (notification) => {
  notifications.unshift({
    id: `notif-${Date.now()}`,
    read: false,
    ...notification,
    time: new Date().toLocaleString()
  });
  
  // Keep only last 100 notifications
  if (notifications.length > 100) {
    notifications = notifications.slice(0, 100);
  }
};