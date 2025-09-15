import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import ProfileHeader from './components/ProfileHeader';
import PersonalInformation from './components/PersonalInformation';
import PreferencesSettings from './components/PreferencesSettings';
import SecuritySettings from './components/SecuritySettings';
import DataExportSettings from './components/DataExportSettings';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showFutureUpdate, setShowFutureUpdate] = useState(true); 

  useEffect(() => {
   
    const userData = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    setTheme(savedTheme);
    document.documentElement?.classList?.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement?.classList?.toggle('dark', newTheme === 'dark');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = (formData) => {
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' },
    { id: 'security', label: 'Security', icon: 'Lock' },
    { id: 'data', label: 'Data & Privacy', icon: 'Database' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background relative">
        {/* Future Update Overlay */}
        <AnimatePresence>
          {showFutureUpdate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
              onClick={() => setShowFutureUpdate(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="relative bg-card border border-border rounded-xl p-8 max-w-md mx-4 elevation-high"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowFutureUpdate(false)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Future Update</h2>
                  <p className="text-muted-foreground">
                    This user profile section is currently in development and will be available in an upcoming release.
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-muted-foreground">
                      You can preview the basic layout, but functionality is not available in this version.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowFutureUpdate(false)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover-lift transition-all"
                  >
                    Got It
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <HeaderNavigation
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NavigationBreadcrumb />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Profile Header */}
              <motion.div variants={itemVariants}>
                <ProfileHeader
                  user={user}
                  isEditing={isEditing}
                  onEditToggle={handleEditToggle}
                />
              </motion.div>

              {/* Tab Navigation */}
              <motion.div variants={itemVariants}>
                <div className="bg-card border border-border rounded-lg p-2 elevation-subtle">
                  <nav className="flex space-x-1 overflow-x-auto">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap hover-lift ${
                          activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground elevation-subtle'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          {tab?.icon === 'User' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {tab?.icon === 'Settings' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {tab?.icon === 'Lock' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                          {tab?.icon === 'Database' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                          )}
                        </div>
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </motion.div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                {activeTab === 'profile' && (
                  <PersonalInformation
                    user={user}
                    isEditing={isEditing}
                    onSave={handleSaveProfile}
                  />
                )}

                {activeTab === 'preferences' && (
                  <PreferencesSettings
                    theme={theme}
                    onThemeToggle={handleThemeToggle}
                  />
                )}

                {activeTab === 'security' && <SecuritySettings />}

                {activeTab === 'data' && <DataExportSettings />}
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthenticationGuard>
  );
};

export default UserProfile;