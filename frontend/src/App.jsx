import React from 'react';
import Navbar from './shared/components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Navbar />
      <div style={{ paddingTop: '120px' }} className="w-full min-h-screen box-border bg-slate-50">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
