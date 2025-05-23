const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get all subscriptions
router.get('/', subscriptionController.getAllSubscriptions);

// Get subscription by ID
router.get('/:id', subscriptionController.getSubscriptionById);

// Create new subscription
router.post(
  '/',
  [
    check('name').trim().not().isEmpty().withMessage('Name is required'),
    check('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    check('billingFrequency')
      .isIn(['Monthly', 'Quarterly', 'Biannual', 'Yearly', 'Custom'])
      .withMessage('Invalid billing frequency'),
    check('nextPaymentDate').isDate().withMessage('Next payment date must be a valid date')
  ],
  subscriptionController.createSubscription
);

// Update subscription
router.put(
  '/:id',
  [
    check('name').optional().trim().not().isEmpty().withMessage('Name cannot be empty'),
    check('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    check('billingFrequency')
      .optional()
      .isIn(['Monthly', 'Quarterly', 'Biannual', 'Yearly', 'Custom'])
      .withMessage('Invalid billing frequency'),
    check('nextPaymentDate').optional().isDate().withMessage('Next payment date must be a valid date')
  ],
  subscriptionController.updateSubscription
);

// Delete subscription
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
