// src/components/RecommendedMetrics.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RecommendedMetrics = ({ metrics }) => {
  return (
    <div className="recommended-section">
      <h2 className="recommended-title">Recommended Metrics</h2>
      <p className="recommended-description">
        These metrics show strong correlation with business outcomes and decision-making.
      </p>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={metrics}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Value Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="score" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {metrics.map((metric, index) => (
        <div key={index} className="metric-item">
          <h3 className="metric-name">{index + 1}. {metric.name}</h3>
          <p className="metric-score">Value score: {metric.score}</p>
          <div className="tag-container">
            <span className="tag tag-impact">Business impact</span>
            <span className="tag tag-driver">Decision driver</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedMetrics;