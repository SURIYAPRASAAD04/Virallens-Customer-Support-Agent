import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationSidebar = ({ 
  conversations, 
  activeConversationId, 
  onConversationSelect, 
  onNewConversation,
  isCollapsed,
  onToggleCollapse 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchQuery?.trim()) {
      const filtered = conversations?.filter(conv => 
        conv?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        conv?.preview?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return messageTime?.toLocaleDateString();
    }
  };

  const sidebarVariants = {
    expanded: {
      width: '320px',
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: '60px',
      opacity: 0.9,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      className="bg-card border-r border-border flex flex-col h-full elevation-subtle"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h2
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-lg font-semibold text-card-foreground"
              >
                Conversations
              </motion.h2>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2"
          >
            <Icon 
              name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} 
              size={16} 
            />
          </Button>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-4 space-y-3"
            >
              {/* New Conversation Button */}
              <Button
                variant="default"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                onClick={onNewConversation}
                className="justify-start"
              >
                New Conversation
              </Button>

              {/* Search */}
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-2 space-y-1"
            >
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading conversations...</p>
                </div>
              ) : filteredConversations?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                filteredConversations?.map((conversation) => (
                  <motion.button
                    key={conversation?.conversation_id}
                    onClick={() => onConversationSelect(conversation?.conversation_id)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 hover:bg-muted group ${
                      activeConversationId === conversation?.conversation_id
                        ? 'bg-primary/10 border border-primary/20' :'hover:bg-muted'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium truncate ${
                          activeConversationId === conversation?.conversation_id
                            ? 'text-primary' :'text-card-foreground'
                        }`}>
                          {conversation?.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {conversation?.preview}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation?.updatedAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {conversation?.messageCount} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State Icons */}
        {isCollapsed && (
          <div className="p-2 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewConversation}
              className="w-full p-3 justify-center"
              title="New Conversation"
            >
              <Icon name="Plus" size={20} />
            </Button>
            
            {conversations?.slice(0, 5)?.map((conversation) => (
              <Button
                key={conversation?.conversation_id}
                variant="ghost"
                size="sm"
                onClick={() => onConversationSelect(conversation?.conversation_id)}
                className={`w-full p-3 justify-center ${
                  activeConversationId === conversation?.conversation_id
                    ? 'bg-primary/10 text-primary' :''
                }`}
                title={conversation?.title}
              >
                <Icon name="MessageSquare" size={16} />
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ConversationSidebar;