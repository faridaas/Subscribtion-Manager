import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import SubscriptionCard from "../components/SubscriptionCard";
import PlusCard from "../components/PlusCard";
import Modal from "../components/Modal";
import FilterDropdown from "../components/FilterDropdown";
import TotalDisplay from "../components/TotalDisplay";
import { subscriptionService } from "../services/subscriptionService";

const HomePage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    appName: "",
    description: "",
    fee: "",
    billingCycle: "Monthly",
    nextPaymentDate: "",
    category: "",
    status: "Active"
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const data = await subscriptionService.getAllSubscriptions();
      // Transform the data to match our frontend format
      const transformedData = data.map(sub => ({
        id: sub.id,
        appName: sub.name,
        description: sub.description,
        fee: `$${sub.cost}`,
        billingCycle: sub.billing_frequency,
        nextPaymentDate: new Date(sub.next_payment_date).toISOString().split('T')[0],
        category: sub.category || 'Uncategorized',
        status: sub.status || 'Active'
      }));
      setSubscriptions(transformedData);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscription = async (id, name) => {
    // Create a custom toast for confirmation
    toast.info(
      <div className="flex flex-col gap-2">
        <p className="font-medium">Are you sure you want to delete {name}?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              // Dismiss the confirmation toast
              toast.dismiss();
              // Execute the deletion
              executeDelete(id, name);
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        className: "bg-white rounded-lg p-4 shadow-lg"
      }
    );
  };

  const executeDelete = async (id, name) => {
    try {
      await subscriptionService.deleteSubscription(id);
      await fetchSubscriptions();
      toast.success(`${name} has been deleted successfully`);
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      toast.error('Failed to delete subscription');
    }
  };

  const handleSaveSubscription = async (formData, editIndex) => {
    try {
      let savedSubscription;
      if (editIndex !== null) {
        // Update existing subscription
        const subscription = subscriptions[editIndex];
        savedSubscription = await subscriptionService.updateSubscription(subscription.id, formData);
      } else {
        // Create new subscription
        savedSubscription = await subscriptionService.createSubscription(formData);
      }

      // Refresh the subscriptions list
      await fetchSubscriptions();
      
      toast.success(editIndex !== null ? 'Subscription updated!' : 'Subscription added!');
      setShowModal(false);
      
      // Reset form data
      setFormData({
        appName: "",
        description: "",
        fee: "",
        billingCycle: "Monthly",
        nextPaymentDate: "",
        category: "",
        status: "Active"
      });
    } catch (error) {
      console.error('Failed to save subscription:', error);
      toast.error('Failed to save subscription');
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
    selectedCategory === "All" ? true : sub.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-indigo-100">
        <div className="text-xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Blurred Content */}
      <div
        className={`flex flex-col min-h-screen bg-sky-50 transition duration-300 ${
          showModal ? "blur-sm opacity-60 pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <Header />

        {/* Divider */}
        <hr className="border-gray-300 my-4" />

        {/* Filter and View Total */}
        <div className="px-6 pb-6">
          <div className="flex justify-between items-center mb-4 px-6">
            <FilterDropdown
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <TotalDisplay subscriptions={filteredSubscriptions} />
          </div>

          {/* Subscription Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscriptions.map((sub, index) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onClick={() => {
                  setFormData(sub);
                  setEditIndex(index);
                  setShowModal(true);
                }}
                onDelete={() => handleDeleteSubscription(sub.id, sub.appName)}
              />
            ))}

            {/* Plus Card */}
            <PlusCard
              setFormData={setFormData}
              setEditIndex={setEditIndex}
              setShowModal={setShowModal}
            />
          </div>
        </div>
      </div>

      {/* Modal pop-up*/}
      {showModal && (
        <Modal
          onSave={handleSaveSubscription}
          formData={formData}
          setFormData={setFormData}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
};

export default HomePage;
