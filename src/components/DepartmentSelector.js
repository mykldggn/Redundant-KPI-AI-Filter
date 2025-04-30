// src/components/DepartmentSelector.js
import React from 'react';

const DepartmentSelector = ({ departments, selectedDepartment, onSelectDepartment }) => {
  return (
    <div className="department-section">
      <h2 className="department-title">Select a Department:</h2>
      <div className="button-container">
        {departments.map(dept => (
          <button
            key={dept}
            className={`department-button ${selectedDepartment === dept ? 'active' : ''}`}
            onClick={() => onSelectDepartment(dept)}
          >
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSelector;
