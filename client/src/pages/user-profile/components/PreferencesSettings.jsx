import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSettings = ({ theme, onThemeToggle }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    voiceInput: true,
    voiceOutput: false,
    autoSave: true,
    dataAnalytics: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const [language, setLanguage] = useState('en');
  const [voiceSettings, setVoiceSettings] = useState({
    speed: 'normal',
    voice: 'female'
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Settings" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-card-foreground">Preferences & Settings</h2>
      </div>
      <div className="space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="text-md font-medium text-card-foreground mb-4">Appearance</h3>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name={theme === 'dark' ? 'Moon' : 'Sun'} size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">
                  {theme === 'dark' ? 'Dark mode is active' : 'Light mode is active'}
                </p>
              </div>
            </div>
            <button
              onClick={onThemeToggle}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                theme === 'dark' ? 'bg-primary' : 'bg-border'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div>
          <h3 className="text-md font-medium text-card-foreground mb-4">Language & Region</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages?.map((lang) => (
              <button
                key={lang?.code}
                onClick={() => setLanguage(lang?.code)}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 hover-lift ${
                  language === lang?.code
                    ? 'border-primary bg-primary/10 text-primary' :'border-border bg-background hover:border-primary/50'
                }`}
              >
                <span className="text-lg">{lang?.flag}</span>
                <span className="text-sm font-medium">{lang?.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div>
          <h3 className="text-md font-medium text-card-foreground mb-4">Voice & Audio</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">Voice Speed</span>
                  <select
                    value={voiceSettings?.speed}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: e?.target?.value }))}
                    className="text-xs bg-background border border-border rounded px-2 py-1 text-card-foreground"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-card-foreground">Voice Type</span>
                  <select
                    value={voiceSettings?.voice}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e?.target?.value }))}
                    className="text-xs bg-background border border-border rounded px-2 py-1 text-card-foreground"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Checkbox
                label="Enable voice input (speech-to-text)"
                description="Allow speaking to send messages"
                checked={preferences?.voiceInput}
                onChange={(e) => handlePreferenceChange('voiceInput', e?.target?.checked)}
              />
              
              <Checkbox
                label="Enable voice output (text-to-speech)"
                description="Hear AI responses spoken aloud"
                checked={preferences?.voiceOutput}
                onChange={(e) => handlePreferenceChange('voiceOutput', e?.target?.checked)}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="text-md font-medium text-card-foreground mb-4">Notifications</h3>
          <div className="space-y-3">
            <Checkbox
              label="Email notifications"
              description="Receive updates and summaries via email"
              checked={preferences?.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
            />
            
            <Checkbox
              label="Push notifications"
              description="Get real-time notifications in browser"
              checked={preferences?.pushNotifications}
              onChange={(e) => handlePreferenceChange('pushNotifications', e?.target?.checked)}
            />
            
            <Checkbox
              label="Security alerts"
              description="Important security and login notifications"
              checked={preferences?.securityAlerts}
              onChange={(e) => handlePreferenceChange('securityAlerts', e?.target?.checked)}
            />
            
            <Checkbox
              label="Marketing emails"
              description="Product updates and feature announcements"
              checked={preferences?.marketingEmails}
              onChange={(e) => handlePreferenceChange('marketingEmails', e?.target?.checked)}
            />
          </div>
        </div>

        {/* Data & Privacy */}
        <div>
          <h3 className="text-md font-medium text-card-foreground mb-4">Data & Privacy</h3>
          <div className="space-y-3">
            <Checkbox
              label="Auto-save conversations"
              description="Automatically save chat history for future reference"
              checked={preferences?.autoSave}
              onChange={(e) => handlePreferenceChange('autoSave', e?.target?.checked)}
            />
            
            <Checkbox
              label="Usage analytics"
              description="Help improve the service by sharing anonymous usage data"
              checked={preferences?.dataAnalytics}
              onChange={(e) => handlePreferenceChange('dataAnalytics', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;