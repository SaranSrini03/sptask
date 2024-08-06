import React from 'react';

const AIInsights = ({ sentiment, confidence }) => {
  const getInsight = () => {
    if (sentiment === 'Positive' && confidence > 0.8) {
      return "The sentiment is strongly positive. This could indicate a favorable market trend or positive public opinion.";
    } else if (sentiment === 'Negative' && confidence > 0.8) {
      return "The sentiment is strongly negative. This might suggest potential risks or challenges in the current context.";
    } else {
      return "The sentiment is mixed or neutral. Further analysis may be needed to draw concrete conclusions.";
    }
  };

  return (
    <div className="ai-insights">
      <h3>AI Insights</h3>
      <p>{getInsight()}</p>
    </div>
  );
};

export default AIInsights;