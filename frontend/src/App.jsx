import React from 'react';
import Navbar from './shared/components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div>
      <Navbar />
      <div className="pt-[80px] w-full min-h-screen box-border">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
