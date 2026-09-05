import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../shared/store/authStore';
import { logoutUser } from '../../auth/services/authService.js';
import axiosInstance from '../../../shared/api/axiosInstance';
import { User, Mail, Shield, LogOut, Key, Edit2, Save, X } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put('/update_profile', { name, email });
      if (res.data.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ ...user, name, email });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card-wrapper">
        
        {/* Main Profile Card */}
        <div className="profile-main-card">
          {/* Banner */}
          <div className="profile-banner">
            {/* Edit Button overlay on Banner */}
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="profile-edit-btn"
                title="Edit Profile"
              >
                <Edit2 size={16} />
              </button>
            ) : (
              <div className="profile-actions-row">
                <button 
                  onClick={handleCancel}
                  className="profile-cancel-btn"
                  title="Cancel"
                  disabled={isLoading}
                >
                  <X size={16} />
                </button>
                <button 
                  onClick={handleSave}
                  className="profile-save-btn"
                  title="Save"
                  disabled={isLoading}
                >
                  <Save size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="profile-content">
            {/* Avatar overlapping banner */}
            <div className="profile-avatar-container">
              <div className="profile-avatar">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>

            {/* Spacer for avatar */}
            <div className="profile-spacer"></div>

            {/* User Info Section */}
            <div className="profile-details">
              
              <div className="profile-field">
                <label className="profile-field-label">
                  <User size={14} /> Full Name
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="profile-input"
                  />
                ) : (
                  <h1 className="profile-name-text">{name}</h1>
                )}
              </div>

              <div className="profile-divider"></div>

              <div className="profile-field">
                <label className="profile-field-label">
                  <Mail size={14} /> Email Address
                </label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="profile-input"
                  />
                ) : (
                  <p className="profile-email-text">{email}</p>
                )}
              </div>

              <div className="profile-divider"></div>

              <div className="profile-field">
                <label className="profile-field-label">
                  <Shield size={14} /> Role & Permissions
                </label>
                <div>
                  <span className="profile-role-badge">
                    {user?.roleId?.name || user?.role || 'User'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Security & Actions */}
        <div className="profile-bottom-card">
          <button 
            onClick={() => navigate('/profile/reset-password')}
            className="profile-action-btn btn-reset"
          >
            <Key size={16} /> Reset Password
          </button>
          
          <button 
            onClick={logoutUser}
            className="profile-action-btn btn-signout"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
