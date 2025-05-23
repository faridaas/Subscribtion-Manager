const NotificationService = require('../services/notificationService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get user notifications
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const filters = {
    read: req.query.read === 'true' ? true : (req.query.read === 'false' ? false : undefined)
  };
  
  const notifications = await NotificationService.getUserNotifications(req.user.id, filters);
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    notifications
  });
});

// Mark notification as read
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const result = await NotificationService.markNotificationAsRead(req.params.id, req.user.id);
  
  if (!result) {
    return next(new ErrorResponse(`Notification not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

// Mark all notifications as read
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  const count = await NotificationService.markAllNotificationsAsRead(req.user.id);
  
  res.status(200).json({
    success: true,
    message: `${count} notifications marked as read`
  });
});

// Get notification settings
exports.getNotificationSettings = asyncHandler(async (req, res, next) => {
  const settings = await NotificationService.getNotificationSettings(req.user.id);
  
  res.status(200).json({
    success: true,
    settings
  });
});

// Update notification settings
exports.updateNotificationSettings = asyncHandler(async (req, res, next) => {
  const settings = await NotificationService.updateNotificationSettings(req.user.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Notification settings updated successfully',
    settings
  });
});
