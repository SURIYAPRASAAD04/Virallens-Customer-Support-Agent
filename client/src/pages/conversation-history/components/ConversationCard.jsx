import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationCard = ({ 
  conversation, 
  isSelected, 
  onSelect, 
  onResume, 
  onDelete,
  searchTerm = '' 
}) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text?.split(regex);
    
    return parts?.map((part, index) => 
      regex?.test(part) ? (
        <mark key={index} className="bg-accent/30 text-accent-foreground rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const getPreviewText = () => {
    if (!conversation?.messages || conversation.messages.length === 0) {
      return { user: '', ai: '' };
    }
    
    const userMessage = conversation.messages.find(msg => msg.isUser);
    const aiMessage = conversation.messages.find(msg => !msg.isUser);
    
    return {
      user: userMessage?.content?.substring(0, 100) + (userMessage?.content?.length > 100 ? '...' : '') || '',
      ai: aiMessage?.content?.substring(0, 100) + (aiMessage?.content?.length > 100 ? '...' : '') || ''
    };
  };

  const preview = getPreviewText();

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:elevation-moderate hover-lift cursor-pointer ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      }`}
      onClick={() => onResume(conversation.conversation_id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(conversation.conversation_id, e.target.checked);
            }}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            onClick={(e) => e.stopPropagation()}
          />
          <div>
            <h3 className="text-sm font-medium text-card-foreground">
              {highlightText(conversation?.title, searchTerm)}
            </h3>
            <p className="text-xs text-muted-foreground">
              {formatDate(conversation?.createdAt || conversation?.updatedAt)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onResume(conversation.conversation_id);
            }}
            iconName="MessageSquare"
            iconSize={14}
            className="text-muted-foreground hover:text-white"
          >
            Resume
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conversation.conversation_id);
            }}
            iconName="Trash2"
            iconSize={14}
            className="text-muted-foreground hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        {preview.user && (
          <div className="text-xs">
            <span className="text-primary font-medium">You: </span>
            <span className="text-muted-foreground">
              {highlightText(preview.user, searchTerm)}
            </span>
          </div>
        )}
        {preview.ai && (
          <div className="text-xs">
            <span className="text-accent font-medium">AI: </span>
            <span className="text-muted-foreground">
              {highlightText(preview.ai, searchTerm)}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="MessageCircle" size={12} />
            <span>{conversation?.messageCount || 0} messages</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{formatDuration(conversation?.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${
            conversation?.status === 'completed' ? 'bg-success' : 
            conversation?.status === 'active' ? 'bg-warning' : 'bg-muted-foreground'
          }`}></div>
          <span className="capitalize">{conversation?.status || 'completed'}</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;