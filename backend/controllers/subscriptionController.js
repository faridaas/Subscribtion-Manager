const { validationResult } = require('express-validator');
const SubscriptionService = require('../services/subscriptionService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get all subscriptions
exports.getAllSubscriptions = asyncHandler(async (req, res, next) => {
  const filters = {
    status: req.query.status,
    category: req.query.category,
    sort: req.query.sort,
    order: req.query.order
  };
  
  const subscriptions = await SubscriptionService.getAllSubscriptions(req.user.id, filters);
  
  res.status(200).json({
    success: true,
    count: subscriptions.length,
    subscriptions
  });
});

// Get subscription by ID
exports.getSubscriptionById = asyncHandler(async (req, res, next) => {
  const subscription = await SubscriptionService.getSubscriptionById(req.params.id, req.user.id);
  
  if (!subscription) {
    return next(new ErrorResponse(`Subscription not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    subscription
  });
});

// Create new subscription
exports.createSubscription = asyncHandler(async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  // Create subscription
  const subscription = await SubscriptionService.createSubscription(req.body, req.user.id);
  
  res.status(201).json({
    success: true,
    message: 'Subscription created successfully',
    subscription
  });
});

// Update subscription
exports.updateSubscription = asyncHandler(async (req, res, next) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  // Update subscription
  const subscription = await SubscriptionService.updateSubscription(
    req.params.id,
    req.user.id,
    req.body
  );
  
  if (!subscription) {
    return next(new ErrorResponse(`Subscription not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    message: 'Subscription updated successfully',
    subscription
  });
});

// Delete subscription
exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  const result = await SubscriptionService.deleteSubscription(req.params.id, req.user.id);
  
  if (!result) {
    return next(new ErrorResponse(`Subscription not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    message: 'Subscription deleted successfully'
  });
});
