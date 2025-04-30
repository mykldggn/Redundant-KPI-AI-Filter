import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricsChart = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Value Score', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Bar dataKey="score" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;