import React from "react";
import { toast } from 'react-toastify';

const Modal = ({
  onSave,
  formData,
  setFormData,
  editIndex,
  setEditIndex,
  setShowModal,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = {
      appName: 'App Name',
      fee: 'Fee',
      nextPaymentDate: 'Next Payment Date'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p className="font-medium mb-2">Please fill in all required fields:</p>
          <ul className="list-disc pl-4">
            {missingFields.map(field => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return false;
    }

    // Validate fee format
    if (!formData.fee.startsWith('$')) {
      setFormData(prev => ({ ...prev, fee: `$${formData.fee}` }));
    }

    return true;
  };

  const handleSaveSubscription = () => {
    if (validateForm()) {
      onSave(formData, editIndex);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <div className="bg-white rounded-2xl p-6 w-96 space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold">
          {editIndex !== null ? "Edit Subscription" : "Add Subscription"}
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="appName" className="text-sm font-medium text-gray-700 mb-1">
              App Name <span className="text-red-500">*</span>
            </label>
            <input
              id="appName"
              type="text"
              name="appName"
              placeholder="Enter app name"
              value={formData.appName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description (optional)"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="fee" className="text-sm font-medium text-gray-700 mb-1">
              Fee <span className="text-red-500">*</span>
            </label>
            <input
              id="fee"
              type="text"
              name="fee"
              placeholder="Enter fee (e.g. $9.99)"
              value={formData.fee}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="billingCycle" className="text-sm font-medium text-gray-700 mb-1">
              Billing Cycle
            </label>
            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Biannual">Biannual</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="nextPaymentDate" className="text-sm font-medium text-gray-700 mb-1">
              Next Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              id="nextPaymentDate"
              type="date"
              name="nextPaymentDate"
              value={formData.nextPaymentDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Select Category</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health-Fitness">Health & Fitness</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                  Active
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                </span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Paused"
                  checked={formData.status === 'Paused'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                  Paused
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                </span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Cancelled"
                  checked={formData.status === 'Cancelled'}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                  Cancelled
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => {
              setShowModal(false);
              setEditIndex(null);
              setFormData({
                appName: "",
                description: "",
                fee: "",
                billingCycle: "Monthly",
                nextPaymentDate: "",
                category: "",
                status: "Active"
              });
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSubscription}
            className="px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors"
          >
            {editIndex !== null ? "Save Changes" : "Add Subscription"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
