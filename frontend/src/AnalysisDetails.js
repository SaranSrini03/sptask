import React from 'react';

const AnalysisDetails = ({ inputType, input, results }) => {
  return (
    <div>
      <p>Analysis Details Placeholder</p>
      <p>Input Type: {inputType}</p>
      <p>Input: {input}</p>
      <p>Results: {JSON.stringify(results)}</p>
    </div>
  );
};

export default AnalysisDetails;