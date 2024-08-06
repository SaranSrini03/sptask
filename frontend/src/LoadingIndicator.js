import React from 'react';

const LoadingIndicator = ({ progress }) => {
  return (
    <div>
      <p>Loading... {progress.toFixed(0)}%</p>
    </div>
  );
};

export default LoadingIndicator;