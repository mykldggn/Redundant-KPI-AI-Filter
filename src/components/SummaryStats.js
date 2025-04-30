// src/components/SummaryStats.js
import React from 'react';

const SummaryStats = ({ stats }) => {
  return (
    <div className="stats-container">
      <h2 className="stats-title">Dashboard Health Summary</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Metrics</p>
          <p className="stat-value stat-value-total">{stats.totalMetrics}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Vanity Metrics</p>
          <p className="stat-value stat-value-vanity">{stats.vanityMetrics}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">% Vanity</p>
          <p className="stat-value stat-value-percent">{stats.percentVanity}%</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;