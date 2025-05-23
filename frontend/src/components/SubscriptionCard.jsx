import React from "react";
import { Trash2 } from "lucide-react";

const SubscriptionCard = ({ subscription, onClick, onDelete }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md p-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg duration-200 cursor-pointer relative group"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{subscription.appName}</h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status || 'Active'}
        </span>
      </div>
      
      {subscription.description && (
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {subscription.description}
        </p>
      )}
      
      <p className="text-gray-700">
        {subscription.fee} ({subscription.billingCycle})
      </p>
      <p className="text-sm text-gray-500">
        Next Payment: {new Date(subscription.nextPaymentDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Category: {subscription.category || "Uncategorized"}
      </p>

      {/* Delete button positioned at bottom right */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200"
          title="Delete subscription"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCard;
