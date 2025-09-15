import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DataExportSettings = () => {
  const [exportOptions, setExportOptions] = useState({
    conversations: true,
    preferences: true,
    analytics: false,
    personalInfo: true
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory] = useState([
    {
      id: 1,
      type: 'Full Export',
      date: '2025-01-10',
      size: '2.4 MB',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      type: 'Conversations Only',
      date: '2024-12-15',
      size: '1.8 MB',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      type: 'Full Export',
      date: '2024-11-20',
      size: '2.1 MB',
      status: 'expired',
      downloadUrl: null
    }
  ]);

  const handleExportOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log('Export completed with options:', exportOptions);
    }, 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'expired':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'expired':
        return 'Clock';
      default:
        return 'AlertCircle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Download" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Export Your Data</h2>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm text-muted-foreground">
            Download a copy of your data. Select what you'd like to include in your export.
          </p>

          <div className="space-y-3">
            <Checkbox
              label="Conversation History"
              description="All your chat conversations and messages"
              checked={exportOptions?.conversations}
              onChange={(e) => handleExportOptionChange('conversations', e?.target?.checked)}
            />
            
            <Checkbox
              label="Account Preferences"
              description="Your settings, themes, and notification preferences"
              checked={exportOptions?.preferences}
              onChange={(e) => handleExportOptionChange('preferences', e?.target?.checked)}
            />
            
            <Checkbox
              label="Usage Analytics"
              description="Your usage statistics and activity data"
              checked={exportOptions?.analytics}
              onChange={(e) => handleExportOptionChange('analytics', e?.target?.checked)}
            />
            
            <Checkbox
              label="Personal Information"
              description="Your profile information and contact details"
              checked={exportOptions?.personalInfo}
              onChange={(e) => handleExportOptionChange('personalInfo', e?.target?.checked)}
            />
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleExportData}
          loading={isExporting}
          iconName="Download"
          iconPosition="left"
          disabled={!Object.values(exportOptions)?.some(Boolean)}
        >
          {isExporting ? 'Preparing Export...' : 'Export Data'}
        </Button>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-card-foreground">Export Information</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your data will be prepared as a ZIP file containing JSON and CSV files. 
                Download links expire after 7 days for security reasons.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Export History */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="History" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">Export History</h2>
        </div>

        <div className="space-y-3">
          {exportHistory?.map((export_item) => (
            <div
              key={export_item?.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon 
                    name={getStatusIcon(export_item?.status)} 
                    size={20} 
                    className={getStatusColor(export_item?.status)} 
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{export_item?.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {export_item?.date} • {export_item?.size}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium capitalize ${getStatusColor(export_item?.status)}`}>
                  {export_item?.status}
                </span>
                {export_item?.status === 'completed' && export_item?.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* CRM Integration */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Database" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">CRM Integration</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your account with popular CRM tools to sync conversation data and customer insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">SF</span>
                  </div>
                  <span className="text-sm font-medium text-card-foreground">Salesforce</span>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sync conversations and customer data with Salesforce CRM
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">HS</span>
                  </div>
                  <span className="text-sm font-medium text-card-foreground">HubSpot</span>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Integrate with HubSpot for comprehensive customer management
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Account Deletion */}
      <div className="bg-card border border-destructive/20 rounded-lg p-6 elevation-subtle">
        <div className="flex items-center space-x-2 mb-6">
          <Icon name="Trash2" size={20} className="text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Delete Account</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-destructive mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Warning</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deleting your account will permanently remove all conversations, preferences, 
                  and personal data. Make sure to export any data you want to keep before proceeding.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataExportSettings;