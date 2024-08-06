import React from 'react';
import { FaNewspaper, FaChartLine, FaRegCalendarAlt } from 'react-icons/fa';

const NewsResults = ({ results }) => {
  const renderNewsItem = (item, index) => {
    const sentiment = item.sentiments[0].toLowerCase();
    const confidenceScore = (item.confidences[0] * 100).toFixed(2);
    
    return (
      <div key={index} className={`news-item ${sentiment}`}>
        <h3><FaNewspaper /> {item.title}</h3>
        <p className="sentiment-label">
          <FaChartLine /> {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
        </p>
        <p className="confidence-score">{confidenceScore}% Confidence</p>
        <p className="date">
          <FaRegCalendarAlt /> {new Date(item.pub_date).toLocaleString()}
        </p>
        <div className="keywords">
          {item.keywords.map((keyword, kidx) => (
            <span key={kidx} className="keyword">{keyword}</span>
          ))}
        </div>
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="read-more-btn">
          Read More
        </a>
      </div>
    );
  };

  return (
    <div className="news-results">
      <h2>News Analysis Results</h2>
      {results.length === 0 ? (
        <div className="no-results">No news results found.</div>
      ) : (
        <div className="news-grid">
          {results.map(renderNewsItem)}
        </div>
      )}
    </div>
  );
};

export default NewsResults;