import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatMessage = ({ 
  message, 
  isUser, 
  timestamp, 
  onCopy, 
  onRegenerate, 
  onSpeak,
  messageId,
  conversationId,
  onMessageUpdate 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(message);
      setIsCopied(true);
      onCopy?.(message);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis?.speak(utterance);
        onSpeak?.(message);
      }
    }
  };

  const handleRegenerate = async () => {
    if (isUser || !messageId || !conversationId) {
      onRegenerate?.();
      return;
    }

    setIsRegenerating(true);
    
    try {
      // Call backend API to regenerate response
      const response = await fetch('https://virallens-agent.onrender.com/api/chat/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          conversationId,
          currentMessage: message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate response');
      }

      const data = await response.json();
      
     
      if (data.regeneratedMessage && onMessageUpdate) {
        onMessageUpdate(messageId, data.regeneratedMessage);
      }
      
      onRegenerate?.(data.regeneratedMessage);
    } catch (error) {
      console.error('Error regenerating response:', error);
      onRegenerate?.();
    } finally {
      setIsRegenerating(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-end space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <Icon 
              name={isUser ? 'User' : 'Bot'} 
              size={16} 
            />
          </div>

          {/* Message Bubble */}
          <div className={`relative max-w-full ${isUser ? 'mr-2' : 'ml-2'}`}>
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm ${
                isUser
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card text-card-foreground border border-border rounded-bl-md'
              }`}
            >
              {isRegenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="text-sm">Regenerating...</span>
                </div>
              ) : (
                <>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message}
                  </div>
                  
                  {/* Timestamp */}
                  <div className={`text-xs mt-2 opacity-70 ${
                    isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {formatTime(timestamp)}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}>
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                className="h-6 px-2 text-xs"
                title={isCopied ? 'Copied!' : 'Copy message'}
                disabled={isRegenerating}
              >
                <Icon 
                  name={isCopied ? 'Check' : 'Copy'} 
                  size={12} 
                  className={isCopied ? 'text-success' : ''} 
                />
              </Button>

              {!isUser && (
                <>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleSpeak}
                    className="h-6 px-2 text-xs"
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                    disabled={isRegenerating}
                  >
                    <Icon 
                      name={isSpeaking ? 'VolumeX' : 'Volume2'} 
                      size={12} 
                      className={isSpeaking ? 'text-warning' : ''} 
                    />
                  </Button>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleRegenerate}
                    className="h-6 px-2 text-xs"
                    title="Regenerate response"
                    disabled={isRegenerating}
                  >
                    <Icon 
                      name={isRegenerating ? "Loader" : "RotateCcw"} 
                      size={12} 
                      className={isRegenerating ? "animate-spin" : ""} 
                    />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;