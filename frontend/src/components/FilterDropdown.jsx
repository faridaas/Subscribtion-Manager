import React from "react";

const FilterDropdown = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="p-2 rounded border border-gray-300 bg-white shadow"
    >
      <option value="All">All Categories</option>
      <option value="Entertainment">Entertainment</option>
      <option value="Health-Fitness">Health & Fitness</option>
      <option value="Education">Education</option>
      <option value="Other">Other</option>
    </select>
  );
};

export default FilterDropdown;
