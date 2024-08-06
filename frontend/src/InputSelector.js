import React from 'react';

const InputSelector = ({ inputType, onInputTypeChange }) => {
  return (
    <div>
      <button onClick={() => onInputTypeChange('text')}>Text</button>
      <button onClick={() => onInputTypeChange('url')}>URL</button>
      <button onClick={() => onInputTypeChange('news')}>News</button>
    </div>
  );
};

export default InputSelector;