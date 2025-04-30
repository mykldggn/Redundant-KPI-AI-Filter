// src/App.js
import React, { useState } from 'react';
import './App.css';
import './styles.css'; // Import the new styles
import KPIAuditTool from './components/KPIAuditTool';

function App() {
  const [file, setFile] = useState(null);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setIsFileLoaded(true);
    }
  };

  return (
    <div className="App min-h-screen p-4 bg-gray-100">
      {!isFileLoaded ? (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">KPI Audit Tool</h1>
          <p className="mb-4 text-gray-700">
            Upload your metrics CSV file to identify vanity metrics and discover which KPIs actually drive outcomes.
          </p>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload your metrics CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>
          <div className="mb-2">
            <button
              onClick={() => {
                // Use sample data
                setIsFileLoaded(true);
              }}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Demo Data
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Don't have data? Click "Try Demo Data" to see the tool in action.
          </p>
        </div>
      ) : (
        <KPIAuditTool uploadedFile={file} />
      )}
    </div>
  );
}

export default App;