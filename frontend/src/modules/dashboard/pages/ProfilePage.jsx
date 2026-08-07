import React from 'react';
import { logoutUser } from '@/modules/auth/services/authService.js';

export default function ProfilePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>

      <button 
        onClick={logoutUser}
        style={{ padding: '10px 20px',margin: '50px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Sign Out
      </button>
      {/* 
        NOTE FOR OTHER TEAMS:
        Team 2/3/4 - You can implement your specific module's profile/dashboard pages here.
        This route is already wrapped in <ProtectedRoute>, so only authenticated users will reach this component.
      */}
{/* 
      <h2>Dashboard Placeholder</h2>
      <p>Other teams will implement their respective dashboards here.</p>
       */}
    </div>
  );
}
