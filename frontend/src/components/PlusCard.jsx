import React from "react";
import { Plus } from "lucide-react";

const PlusCard = ({ setFormData, setEditIndex, setShowModal }) => {
  return (
    <div
      onClick={() => {
        setFormData({
          appName: "",
          fee: "",
          billingCycle: "Monthly",
          nextPaymentDate: "",
          category: "",
        });
        setEditIndex(null);
        setShowModal(true);
      }}
      className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-center cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform duration-200"
    >
      <Plus className="w-12 h-12 text-cyan-700" />
    </div>
  );
};

export default PlusCard;
