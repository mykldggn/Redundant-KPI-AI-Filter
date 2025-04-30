// src/components/MetricsToReconsider.js
import React from 'react';

const MetricsToReconsider = ({ metrics }) => {
  return (
    <div className="reconsider-section">
      <h2 className="reconsider-title">Metrics to Reconsider</h2>
      <p className="reconsider-description">
        These metrics may be misleading or not driving actual outcomes.
      </p>
      
      {metrics.map((metric, index) => (
        <div key={index} className="reconsider-item">
          <h3 className="metric-name">{index + 1}. {metric.name}</h3>
          <p className="issue-label">Issue: {metric.reason}</p>
          <div className="tag-container">
            <span className="tag tag-low-impact">Low impact</span>
            {metric.reason?.includes('vanity') && (
              <span className="tag tag-vanity">Vanity metric</span>
            )}
            {metric.reason?.includes('not used') && (
              <span className="tag tag-not-actionable">Not actionable</span>
            )}
          </div>
        </div>
      ))}
      
      <div className="recommendations-box">
        <h3 className="recommendations-title">Improvement Recommendations</h3>
        <ul className="recommendations-list">
          <li>Remove these metrics from dashboards to reduce noise</li>
          <li>Replace with recommended metrics on the left</li>
          <li>Set up regular metric reviews (quarterly minimum)</li>
          <li>Ensure each metric has a clear owner and decision path</li>
        </ul>
      </div>
    </div>
  );
};

export default MetricsToReconsider;