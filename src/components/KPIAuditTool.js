// src/components/KPIAuditTool.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SummaryStats from './SummaryStats';
import DepartmentSelector from './DepartmentSelector';
import RecommendedMetrics from './RecommendedMetrics';
import MetricsToReconsider from './MetricsToReconsider';

const KPIAuditTool = ({ uploadedFile }) => {
  // eslint-disable-next-line no-unused-vars
  const [metricsData, setMetricsData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMetrics: 0,
    vanityMetrics: 0,
    percentVanity: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        let data;
        
        if (uploadedFile) {
          // Use uploaded file
          data = await readFileContent(uploadedFile);
        } else {
          // Use sample data
          try {
            const response = await fetch('/sample-data.csv');
            data = await response.text();
          } catch (error) {
            console.error('Error loading sample data:', error);
            // Use embedded sample data as fallback
            data = `Department,Metric_Name,Visible_in_Dashboard,Used_in_Decision_Making,Executive_Requested,Last_Reviewed,Metric_Last_Used_For_Decision,Interpretation_Notes
Marketing,OKR Progress,No,No,No,This week,2 weeks ago,Drives vanity OKRs
Finance,Leads Generated,Yes,No,No,Last month,Used in QBR,Tied to real goals
Engineering,OKR Progress,Yes,Yes,Yes,Last month,Recently,Auto-synced from tool
Marketing,Demo Requests,No,Yes,No,Last month,2 weeks ago,Tied to real goals
Engineering,Daily Active Users,Yes,No,No,Last quarter,Last quarter,Auto-synced from tool
Finance,Code Commits,Yes,No,No,Unknown,Recently,Updated manually`;
          }
        }
        
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processData(results.data);
          }
        });
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [uploadedFile]);

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const processData = (data) => {
    setMetricsData(data);
    const analysis = analyzeMetrics(data);
    setAnalysisResults(analysis);
    
    // Calculate stats
    let totalVanityMetrics = 0;
    let totalMetrics = data.length;
    
    Object.keys(analysis).forEach(dept => {
      totalVanityMetrics += analysis[dept].vanityMetrics.length;
    });
    
    setStats({
      totalMetrics,
      vanityMetrics: totalVanityMetrics,
      percentVanity: Math.round((totalVanityMetrics / totalMetrics) * 100)
    });
    
    // Set default selected department
    setSelectedDepartment(Object.keys(analysis)[0]);
    setLoading(false);
  };

  // Helper function to determine why a metric is considered a vanity metric
  const determineVanityReason = (row) => {
    if (row.Visible_in_Dashboard === 'Yes' && row.Used_in_Decision_Making === 'No') {
      return "Visible but not used in decisions";
    } else if (row.Interpretation_Notes?.includes('Drives vanity')) {
      return "Drives vanity OKRs";
    } else if (row.Interpretation_Notes?.includes('Used for optics only')) {
      return "Used for optics only";
    } else if (row.Interpretation_Notes?.includes('Often misinterpreted')) {
      return "Often misinterpreted";
    } else if (row.Metric_Last_Used_For_Decision === 'Never') {
      return "Never used for decisions";
    } else if (row.Last_Reviewed === 'Unknown') {
      return "Review status unknown";
    }
    return "Multiple issues";
  };

  // Helper function to calculate a value score for metrics
  const calculateValueScore = (row) => {
    let score = 0;
    
    // Decision making value
    if (row.Used_in_Decision_Making === 'Yes') score += 3;
    
    // Recency of use in decisions
    if (row.Metric_Last_Used_For_Decision === 'Recently') score += 3;
    else if (row.Metric_Last_Used_For_Decision === '2 weeks ago') score += 2;
    else if (row.Metric_Last_Used_For_Decision === 'Used in QBR') score += 1;
    
    // Recency of review
    if (row.Last_Reviewed === 'This week') score += 2;
    else if (row.Last_Reviewed === 'Last month') score += 1;
    
    // Quality of interpretation
    if (row.Interpretation_Notes?.includes('Tied to real goals')) score += 3;
    if (row.Interpretation_Notes?.includes('Frequently discussed')) score += 1;
    if (row.Interpretation_Notes?.includes('Auto-synced from tool')) score += 1;
    
    return score;
  };

  // Helper function to identify vanity metrics and valuable metrics
  const analyzeMetrics = (data) => {
    const results = {};
    
    // Process metrics by department
    data.forEach(row => {
      if (!results[row.Department]) {
        results[row.Department] = {
          vanityMetrics: [],
          valuableMetrics: [],
          allMetrics: []
        };
      }
      
      // Store all metrics
      results[row.Department].allMetrics.push({
        name: row.Metric_Name,
        visible: row.Visible_in_Dashboard,
        usedInDecision: row.Used_in_Decision_Making,
        executiveRequested: row.Executive_Requested,
        lastReviewed: row.Last_Reviewed,
        lastUsed: row.Metric_Last_Used_For_Decision,
        notes: row.Interpretation_Notes
      });
      
      // Identify vanity metrics (visible but not used in decisions, or with concerning notes)
      const vanityIndicators = [
        row.Visible_in_Dashboard === 'Yes' && row.Used_in_Decision_Making === 'No',
        row.Interpretation_Notes?.includes('Drives vanity'),
        row.Interpretation_Notes?.includes('Used for optics only'),
        row.Interpretation_Notes?.includes('Often misinterpreted'),
        row.Metric_Last_Used_For_Decision === 'Never',
        row.Last_Reviewed === 'Unknown'
      ];
      
      if (vanityIndicators.some(indicator => indicator)) {
        results[row.Department].vanityMetrics.push({
          name: row.Metric_Name,
          reason: determineVanityReason(row)
        });
      }
      
      // Calculate value score for all metrics (not just those that meet threshold)
      const score = calculateValueScore(row);
      
      // Add to valuable metrics list with score
      results[row.Department].valuableMetrics.push({
        name: row.Metric_Name,
        score: score
      });
    });
    
    // Sort valuable metrics by score for each department
    for (const dept in results) {
      results[dept].valuableMetrics.sort((a, b) => b.score - a.score);
      
      // Always take top 3 metrics regardless of threshold
      results[dept].top3 = results[dept].valuableMetrics.slice(0, 3);
      
      // Make sure we have 3 vanity metrics for each department
      if (results[dept].vanityMetrics.length < 3) {
        // Add lowest scoring metrics as "Low business impact" metrics if needed
        const lowValueMetrics = [...results[dept].valuableMetrics]
          .sort((a, b) => a.score - b.score)
          .filter(metric => 
            !results[dept].vanityMetrics.some(vm => vm.name === metric.name)
          )
          .slice(0, 3 - results[dept].vanityMetrics.length);
        
        lowValueMetrics.forEach(metric => {
          results[dept].vanityMetrics.push({
            name: metric.name,
            reason: "Low business impact"
          });
        });
      }
    }
    
    return results;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-indigo-600">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading KPI data...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>AI-Powered KPI Audit Tool</h1>
      <p>Identify and replace metrics that don't drive outcomes with ones that do.</p>
      
      <SummaryStats stats={stats} />

      <DepartmentSelector 
        departments={analysisResults ? Object.keys(analysisResults) : []}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
      />

      {selectedDepartment && analysisResults && (
        <div className="metrics-grid">
          <RecommendedMetrics 
            metrics={analysisResults[selectedDepartment].top3.slice(0, 3)} 
          />
          
          <MetricsToReconsider 
            metrics={analysisResults[selectedDepartment].vanityMetrics.slice(0, 3)} 
          />
        </div>
      )}
    </div>
  );
};

export default KPIAuditTool;