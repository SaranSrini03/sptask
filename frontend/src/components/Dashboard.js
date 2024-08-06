import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FaChartBar, FaFileAlt, FaInfoCircle, FaLanguage } from 'react-icons/fa';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const SentimentDistributionPie = ({ sentiments, confidences }) => {
  const data = sentiments.map((sentiment, index) => ({
    name: sentiment,
    value: confidences[index]
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

const SentimentTrendLine = ({ trendData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={trendData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const Dashboard = ({ results }) => {
  const { sentiments, confidences, keywords } = results;

  // Mock data for sentiment trend - replace this with actual data when available
  const mockTrendData = [
    { date: '2023-01', sentiment: 0.2 },
    { date: '2023-02', sentiment: 0.5 },
    { date: '2023-03', sentiment: 0.3 },
    { date: '2023-04', sentiment: 0.8 },
    { date: '2023-05', sentiment: 0.6 },
  ];

  return (
    <div className="dashboard">
      <h2>Sentiment Analysis Dashboard</h2>
      <div className="dashboard-grid">
        <div className="card primary-sentiment">
          <h3><FaChartBar /> Primary Sentiment</h3>
          <div className="sentiment-gauge">
            <div className={`gauge ${sentiments[0].toLowerCase()}`} style={{ '--percentage': `${confidences[0] * 100}%` }}>
              <div className="gauge-body">
                <div className="gauge-fill"></div>
                <div className="gauge-cover">{(confidences[0] * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
          <p className="sentiment-label">{sentiments[0]}</p>
        </div>
        <div className="card sentiment-distribution">
          <h3><FaChartBar /> Sentiment Distribution</h3>
          <SentimentDistributionPie sentiments={sentiments} confidences={confidences} />
        </div>
        <div className="card keywords">
          <h3><FaFileAlt /> Keywords</h3>
          <div className="keywords">
            {keywords.map((keyword, index) => (
              <span key={index} className="keyword">{keyword}</span>
            ))}
          </div>
        </div>
        <div className="card sentiment-trend">
          <h3><FaChartBar /> Sentiment Trend</h3>
          <SentimentTrendLine trendData={mockTrendData} />
        </div>
        <div className="card analysis-details">
          <h3><FaInfoCircle /> Analysis Details</h3>
          <p><FaLanguage /> <strong>Language:</strong> English</p>
          <p><FaFileAlt /> <strong>Analysis Type:</strong> Text Input</p>
          <p><strong>Word Count:</strong> {results.text ? results.text.split(' ').length : 'N/A'}</p>
          <p><strong>Primary Sentiment:</strong> {sentiments[0]}</p>
          <p><strong>Confidence:</strong> {(confidences[0] * 100).toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;