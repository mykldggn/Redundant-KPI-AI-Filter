// Helper function to determine why a metric is considered a vanity metric
export const determineVanityReason = (row) => {
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
export const calculateValueScore = (row) => {
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
export const analyzeMetrics = (data) => {
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
