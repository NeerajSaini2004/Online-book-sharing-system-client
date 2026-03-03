import React from 'react';
import './DeliveryProgressBar.css';

const DeliveryProgressBar = ({ currentStep = 0 }) => {
  const steps = ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="progress-container">
      {steps.map((step, index) => (
        <div key={index} className="step-wrapper">
          <div className={`step ${index <= currentStep ? 'active' : ''}`}>
            <div className="step-number">{index + 1}</div>
          </div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && (
            <div className={`connector ${index < currentStep ? 'active' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeliveryProgressBar;