import React from 'react';

const FeatureSelection = ({ onSelect }) => {
  return (
    <div className="feature-selection">
      <div className="feature-card" onClick={() => onSelect('text')}>
        <h2>Text Sentiment</h2>
        <p>Analyze sentiment of any text input</p>
        <ul>
          <li>Social media posts</li>
          <li>Customer reviews</li>
          <li>Any text content</li>
        </ul>
        <div className="card-footer">
          <span>Premium</span>
          <button>Select</button>
        </div>
      </div>
      
      <div className="feature-card" onClick={() => onSelect('url')}>
        <h2>URL Analysis</h2>
        <p>Analyze sentiment of web content</p>
        <ul>
          <li>News articles</li>
          <li>Blog posts</li>
          <li>Web pages</li>
        </ul>
        <div className="card-footer">
          <span>Premium</span>
          <button>Select</button>
        </div>
      </div>
      
      <div className="feature-card" onClick={() => onSelect('news')}>
        <h2>News Analysis</h2>
        <p>Analyze sentiment of news articles</p>
        <ul>
          <li>Latest news</li>
          <li>Topic-specific analysis</li>
          <li>Multiple sources</li>
        </ul>
        <div className="card-footer">
          <span>Premium</span>
          <button>Select</button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelection;