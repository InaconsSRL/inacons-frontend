import React from 'react';
import './LoaderPage.css';

const LoaderPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-80 bg-gray-100/0 scale-50">
      <div className="loader"></div>
    </div>
  );
};

export default LoaderPage;