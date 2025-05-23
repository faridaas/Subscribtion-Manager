import React from "react";

const TotalDisplay = ({ subscriptions }) => {
  const total = subscriptions
    .filter(sub => sub.status?.toLowerCase() === 'active') // Only include active subscriptions
    .reduce((sum, sub) => {
      const fee = parseFloat(sub.fee.replace("$", ""));
      return sum + (isNaN(fee) ? 0 : fee);
    }, 0);

  return (
    <div className="text-lg font-semibold text-cyan-700">
      Total: ${total.toFixed(2)}
    </div>
  );
};

export default TotalDisplay;
