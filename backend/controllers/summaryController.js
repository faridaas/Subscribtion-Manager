const SummaryService = require('../services/summaryService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Get spending summary
exports.getSpendingSummary = asyncHandler(async (req, res, next) => {
  const { period, startDate, endDate } = req.query;
  
  const summary = await SummaryService.getSpendingSummary(
    req.user.id, 
    { period, startDate, endDate }
  );
  
  res.status(200).json({
    success: true,
    period: period || 'monthly',
    summary
  });
});

// Get category statistics
exports.getCategoryStatistics = asyncHandler(async (req, res, next) => {
  const categories = await SummaryService.getCategoryStatistics(req.user.id);
  
  res.status(200).json({
    success: true,
    categories
  });
});
