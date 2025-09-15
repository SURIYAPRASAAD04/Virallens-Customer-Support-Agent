import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';



const ChatHeader = ({ 
  conversationTitle, 
  isOnline, 
  onClearChat, 
  onToggleTheme, 
  theme,
  onToggleSidebar,
  isSidebarCollapsed,
  conversationId,
  onTitleUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(conversationTitle || '');
  const [isSaving, setIsSaving] = useState(false);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const handleEditStart = () => {
    setEditedTitle(conversationTitle || '');
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditedTitle(conversationTitle || '');
    setIsEditing(false);
  };

  const handleSaveTitle = async () => {
    if (!conversationId || !editedTitle.trim() || editedTitle === conversationTitle) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('https://virallens-agent.onrender.com/api/conversations/update-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          title: editedTitle.trim()
        })
      });

      if (response.ok) {
        onTitleUpdate(editedTitle.trim());
        setIsEditing(false);
      } else {
        throw new Error('Failed to update title');
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
     
      setEditedTitle(conversationTitle || '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-card border-b border-border px-6 py-4 flex items-center justify-between elevation-subtle"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="lg:hidden p-2"
        >
          <Icon name="Menu" size={20} />
        </Button>

        {/* Conversation Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Bot" size={20} color="white" />
            </div>
            {/* Online Status Indicator */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
              isOnline ? 'bg-success' : 'bg-muted-foreground'
            }`}>
              {isOnline && (
                <motion.div
                  className="w-full h-full bg-success rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isSaving}
                  className="bg-background border border-border rounded px-2 py-1 text-lg font-semibold text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
                  autoFocus
                />
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveTitle}
                    loading={isSaving}
                    className="p-1 h-6 w-6"
                    title="Save"
                  >
                    <Icon name="Check" size={14} className="text-success" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditCancel}
                    disabled={isSaving}
                    className="p-1 h-6 w-6"
                    title="Cancel"
                  >
                    <Icon name="X" size={14} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 group">
                <h1 className="text-lg font-semibold text-card-foreground">
                  {conversationTitle || 'New Conversation'}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditStart}
                  className="p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground hover:text-white"
                  title="Edit conversation title"
                >
                  <Icon name="Edit3" size={14} className="text-muted-foreground text-white" />
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success' : 'bg-muted-foreground'}`} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
              <span>•</span>
              <span>Responds instantly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTheme}
          className="p-2"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon 
              name={theme === 'dark' ? 'Sun' : 'Moon'} 
              size={18} 
            />
          </motion.div>
        </Button>
       
      </div>
    </motion.div>
  );
};

export default ChatHeader;