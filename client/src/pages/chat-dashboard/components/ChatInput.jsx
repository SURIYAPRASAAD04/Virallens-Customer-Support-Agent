import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        setMessage(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() && !isLoading && !disabled) {
      onSendMessage(message?.trim());
      setMessage('');
      adjustTextareaHeight();
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef?.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef?.current?.scrollHeight, 120)}px`;
    }
  };

  const handleInputChange = (e) => {
    setMessage(e?.target?.value);
    adjustTextareaHeight();
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition?.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition?.stop();
      setIsListening(false);
    }
  };

  const canSend = message?.trim() && !isLoading && !disabled;

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end space-x-3">
          {/* Voice Input Button */}
          {recognition && (
            <Button
              type="button"
              variant={isListening ? "default" : "ghost"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={disabled}
              className="mb-2"
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Icon 
                  name={isListening ? 'MicOff' : 'Mic'} 
                  size={16} 
                  className={isListening ? 'text-primary-foreground' : ''} 
                />
              </motion.div>
            </Button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Type your message... (Shift+Enter for new line)'}
              disabled={disabled || isListening}
              className="w-full px-4 py-3 pr-12 bg-card border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm leading-relaxed max-h-[120px] overflow-y-auto"
              rows={1}
              style={{ minHeight: '48px' }}
            />
            
            {/* Character Count */}
            {message?.length > 0 && (
              <div className="absolute bottom-1 left-3 text-xs text-muted-foreground">
                {message?.length}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={!canSend}
            loading={isLoading}
            className="mb-2 px-4 py-3 rounded-2xl"
            title="Send message (Enter)"
          >
            <motion.div
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
            >
              <Icon 
                name="Send" 
                size={16} 
                className={canSend ? 'text-primary-foreground' : ''} 
              />
            </motion.div>
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            {isListening && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-primary"
              >
                <div className="flex space-x-1">
                  <motion.div
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  />
                  <motion.div
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1 h-1 bg-primary rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </div>
                <span>Listening...</span>
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Press Enter to send, Shift+Enter for new line</span>
            {recognition && (
              <span>• Voice input available</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;