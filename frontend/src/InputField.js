import React from 'react';

const InputField = ({ inputType, input, onInputChange, onSubmit, loading }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={`Enter ${inputType} here...`}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default InputField;