import React from 'react';

const SentimentGauge = ({ sentiment, confidence }) => {
  return (
    <div>
      <p>Sentiment Gauge Placeholder</p>
      <p>Sentiment: {sentiment}</p>
      <p>Confidence: {confidence * 100}%</p>
    </div>
  );
};

export default SentimentGauge;