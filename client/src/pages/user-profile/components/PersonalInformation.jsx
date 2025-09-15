import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PersonalInformation = ({ user, isEditing, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    timezone: user?.timezone || 'UTC-5 (Eastern Time)'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="User" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Personal Information</h2>
        </div>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          type="text"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          disabled={!isEditing}
          error={errors?.name}
          required
          placeholder="Enter your full name"
        />

        <Input
          label="Email Address"
          type="email"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          disabled={!isEditing}
          error={errors?.email}
          required
          placeholder="Enter your email address"
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          disabled={!isEditing}
          placeholder="Enter your phone number"
        />

        <Input
          label="Company"
          type="text"
          value={formData?.company}
          onChange={(e) => handleInputChange('company', e?.target?.value)}
          disabled={!isEditing}
          placeholder="Enter your company name"
        />

        <Input
          label="Job Title"
          type="text"
          value={formData?.jobTitle}
          onChange={(e) => handleInputChange('jobTitle', e?.target?.value)}
          disabled={!isEditing}
          placeholder="Enter your job title"
        />

        <Input
          label="Timezone"
          type="text"
          value={formData?.timezone}
          onChange={(e) => handleInputChange('timezone', e?.target?.value)}
          disabled={!isEditing}
          placeholder="Select your timezone"
        />
      </div>
      {!isEditing && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm text-card-foreground font-medium">Profile Settings</p>
              <p className="text-xs text-muted-foreground mt-1">
                Profile settings are not yet integrated. A prototype is available, and full personalized profile features will be released in a future update.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;