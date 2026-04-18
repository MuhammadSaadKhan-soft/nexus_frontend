import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = e => setProfileForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePasswordChange = e => setPasswordForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async e => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordMsg('Passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    try {
      await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordMsg('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="page-title">My Profile</h1>

      <div className="profile-layout">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-initials-lg">{user?.name?.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
        </div>

        {/* Forms */}
        <div className="profile-forms">
          {/* Profile Info */}
          <div className="profile-card">
            <h3>Personal Information</h3>
            <form onSubmit={handleProfileSubmit}>
              {[
                { label: 'Full Name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'tel' },
              ].map(field => (
                <div key={field.name} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={profileForm[field.name]}
                    onChange={handleProfileChange}
                  />
                </div>
              ))}
              {profileMsg && <p className={profileMsg.includes('success') ? 'form-success' : 'form-error'}>{profileMsg}</p>}
              <button type="submit" className="btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              {[
                { label: 'Current Password', name: 'currentPassword' },
                { label: 'New Password', name: 'newPassword' },
                { label: 'Confirm New Password', name: 'confirm' },
              ].map(field => (
                <div key={field.name} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type="password"
                    name={field.name}
                    value={passwordForm[field.name]}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              ))}
              {passwordMsg && <p className={passwordMsg.includes('success') ? 'form-success' : 'form-error'}>{passwordMsg}</p>}
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}