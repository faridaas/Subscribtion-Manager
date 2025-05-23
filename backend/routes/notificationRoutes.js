const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get user notifications
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

// Get notification settings
router.get('/settings', notificationController.getNotificationSettings);

// Update notification settings
router.put('/settings', 
  [
    check('emailNotifications').optional().isBoolean().withMessage('Email notifications must be a boolean'),
    check('pushNotifications').optional().isBoolean().withMessage('Push notifications must be a boolean'),
    check('reminderDays').optional().isInt({ min: 1, max: 30 }).withMessage('Reminder days must be between 1 and 30')
  ],
  notificationController.updateNotificationSettings
);

module.exports = router;
