import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SecuritySettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [sessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2 minutes ago',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      current: false,
      ip: '192.168.1.101'
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'Boston, MA',
      lastActive: '3 days ago',
      current: false,
      ip: '10.0.0.50'
    }
  ]);

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev?.[field]
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (!passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = () => {
    if (validatePasswordForm()) {
      // Handle password change
      console.log('Password change submitted');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleSessionTerminate = (sessionId) => {
    console.log('Terminating session:', sessionId);
  };

  const handleTerminateAllSessions = () => {
    console.log('Terminating all other sessions');
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Lock" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Change Password</h2>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPasswords?.current ? 'text' : 'password'}
              value={passwordForm?.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
              error={errors?.currentPassword}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name={showPasswords?.current ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="New Password"
              type={showPasswords?.new ? 'text' : 'password'}
              value={passwordForm?.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
              error={errors?.newPassword}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name={showPasswords?.new ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showPasswords?.confirm ? 'text' : 'password'}
              value={passwordForm?.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
              error={errors?.confirmPassword}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <Icon name={showPasswords?.confirm ? 'EyeOff' : 'Eye'} size={16} />
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handlePasswordSubmit}
            iconName="Save"
            iconPosition="left"
            className="mt-4"
          >
            Update Password
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-card-foreground mb-2">Password Requirements</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Monitor" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Active Sessions</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTerminateAllSessions}
            iconName="LogOut"
            iconPosition="left"
          >
            End All Other Sessions
          </Button>
        </div>

        <div className="space-y-4">
          {sessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={session?.device?.includes('iPhone') ? 'Smartphone' : 'Monitor'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-card-foreground">{session?.device}</p>
                    {session?.current && (
                      <span className="px-2 py-1 bg-success text-success-foreground text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{session?.location}</p>
                  <p className="text-xs text-muted-foreground">Last active: {session?.lastActive}</p>
                </div>
              </div>
              
              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSessionTerminate(session?.id)}
                  iconName="X"
                  iconPosition="left"
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Security Notice</p>
              <p className="text-xs text-muted-foreground mt-1">
                If you notice any suspicious activity or unrecognized sessions, terminate them immediately and change your password.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-card-foreground">Two-Factor Authentication</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
          >
            Enable 2FA
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Two-Factor Authentication is disabled</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add an extra layer of security to your account by enabling 2FA with an authenticator app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;