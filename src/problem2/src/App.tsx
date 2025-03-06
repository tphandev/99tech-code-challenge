import React from 'react';
import CurrencySwapForm from './components/CurrencySwapForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center p-4">
      <CurrencySwapForm />
    </div>
  );
};

export default App;