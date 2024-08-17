// src/components/StatusIndicators.js
import React from 'react';

const StatusIndicators = ({ isTyping }) => {
  return (
    <div className="text-gray-500 text-sm">
      {isTyping ? 'User is typing...' : ''}
    </div>
  );
};

export default StatusIndicators;
