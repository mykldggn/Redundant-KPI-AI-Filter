// File utilities for handling CSV files
export const readCsvFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  export const parseCsvData = (csvText, callback) => {
    const Papa = require('papaparse');
    
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: callback
    });
  };
  
  // Sample data generator for demo mode
  export const generateSampleData = () => {
    const departments = ['Marketing', 'Finance', 'Engineering', 'Operations', 'Sales', 'Support', 'Product'];
    const metricNames = ['OKR Progress', 'Leads Generated', 'Daily Active Users', 'Revenue', 'Customer Churn', 
                        'Bug Count', 'Test Coverage', 'Deployment Frequency', 'Email Open Rate', 
                        'Customer Touchpoints', 'Ticket Resolution Time'];
    const yesNo = ['Yes', 'No'];
    const lastReviewed = ['This week', 'Last month', 'Last quarter', 'Unknown'];
    const lastUsed = ['Recently', '2 weeks ago', 'Used in QBR', 'Last quarter', 'Never', 'Don\'t know'];
    const notes = ['Drives vanity OKRs', 'Tied to real goals', 'Auto-synced from tool', 
                  'Updated manually', 'Used for optics only', 'Frequently discussed', 
                  'Unclear ownership', 'Often misinterpreted'];
    
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const sampleData = [];
    
    // Generate 50 random metrics
    for (let i = 0; i < 50; i++) {
      sampleData.push({
        Department: randomChoice(departments),
        Metric_Name: randomChoice(metricNames),
        Visible_in_Dashboard: randomChoice(yesNo),
        Used_in_Decision_Making: randomChoice(yesNo),
        Executive_Requested: randomChoice(yesNo),
        Last_Reviewed: randomChoice(lastReviewed),
        Metric_Last_Used_For_Decision: randomChoice(lastUsed),
        Interpretation_Notes: randomChoice(notes)
      });
    }
    
    return sampleData;
  };
  