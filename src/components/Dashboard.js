import React from 'react';
import SummaryStats from './SummaryStats';
import DepartmentSelector from './DepartmentSelector';
import RecommendedMetrics from './RecommendedMetrics';
import MetricsToReconsider from './MetricsToReconsider';

const Dashboard = ({ 
  stats, 
  analysisResults, 
  selectedDepartment, 
  setSelectedDepartment 
}) => {
  if (!analysisResults) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
        <p className="text-yellow-800">No metrics data available. Please upload a CSV file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">AI-Powered KPI Audit Tool</h1>
        <p className="text-indigo-600 font-medium">Identify and replace metrics that don't drive outcomes with ones that do.</p>
        
        <SummaryStats stats={stats} />
      </div>

      <DepartmentSelector 
        departments={Object.keys(analysisResults)} 
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
      />

      {selectedDepartment && (
        <div className="grid md:grid-cols-2 gap-6">
          <RecommendedMetrics 
            metrics={analysisResults[selectedDepartment].top3.slice(0, 3)} 
          />
          
          <MetricsToReconsider 
            metrics={analysisResults[selectedDepartment].vanityMetrics.slice(0, 3)} 
          />
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">About This Tool</h2>
        <p className="text-gray-700">
          The KPI Audit Tool helps teams identify metrics that may not be driving real business outcomes.
          Focus on the recommended metrics for each department to improve decision-making and eliminate dashboard noise.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;