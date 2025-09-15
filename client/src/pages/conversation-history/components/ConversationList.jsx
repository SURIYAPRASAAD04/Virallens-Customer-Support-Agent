import React from 'react';
import ConversationCard from './ConversationCard';
import Icon from '../../../components/AppIcon';

const ConversationList = ({ 
  conversations, 
  selectedConversations, 
  onSelectConversation, 
  onResumeConversation, 
  onDeleteConversation,
  searchTerm,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <div>
                  <div className="h-4 bg-muted rounded w-48 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 mb-3">
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <div className="h-3 bg-muted rounded w-20"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="MessageSquare" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
        <p className="text-muted-foreground mb-6">
          {searchTerm 
            ? `No conversations match your search for "${searchTerm}"`
            : "You haven't started any conversations yet. Start chatting to see your history here."
          }
        </p>
        {!searchTerm && (
          <button 
            onClick={() => window.location.href = '/chat-dashboard'}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            <Icon name="Plus" size={16} />
            <span>Start New Conversation</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.conversation_id}
          conversation={conversation}
          isSelected={selectedConversations.includes(conversation.conversation_id)}
          onSelect={onSelectConversation}
          onResume={onResumeConversation}
          onDelete={onDeleteConversation}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
};

export default ConversationList;