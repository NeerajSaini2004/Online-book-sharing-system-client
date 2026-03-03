import React, { useState } from 'react';
import DeliveryProgressBar from './DeliveryProgressBar';

const DeliveryExample = () => {
  const [currentStep, setCurrentStep] = useState(1); // 0=Pending, 1=Shipped, 2=Out for Delivery, 3=Delivered

  return (
    <div style={{ padding: '20px' }}>
      <h2>Order Delivery Status</h2>
      <DeliveryProgressBar currentStep={currentStep} />
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
          Previous Step
        </button>
        <button 
          onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
          style={{ marginLeft: '10px' }}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

export default DeliveryExample;