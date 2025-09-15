import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const WelcomeScreen = ({ onStartConversation, userName }) => {
  const suggestions = [
    {
      icon: 'HelpCircle',
      title: 'Get Help',
      description: 'Ask questions about products or services',
      prompt: 'I need help with...'
    },
    {
      icon: 'MessageSquare',
      title: 'Start Chatting',
      description: 'Begin a casual conversation',
      prompt: 'Hello! How are you today?'
    },
    {
      icon: 'Lightbulb',
      title: 'Get Ideas',
      description: 'Brainstorm solutions or creative ideas',
      prompt: 'I need ideas for...'
    },
    {
      icon: 'Search',
      title: 'Find Information',
      description: 'Search for specific information',
      prompt: 'Can you tell me about...'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const handleSuggestionClick = (prompt) => {
    onStartConversation(prompt);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Zap" size={32} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome{userName ? `, ${userName}` : ''}!
          </h1>
          <p className="text-lg text-muted-foreground">
            I'm your AI-powered customer support assistant. How can I help you today?
          </p>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
              <Icon name="Zap" size={20} className="text-primary" />
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Instant Responses</h3>
                <p className="text-sm text-muted-foreground">Get answers in real-time</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
              <Icon name="Shield" size={20} className="text-primary" />
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">Your data is protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
              <Icon name="History" size={20} className="text-primary" />
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Conversation History</h3>
                <p className="text-sm text-muted-foreground">Access past conversations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border">
              <Icon name="Mic" size={20} className="text-primary" />
              <div className="text-left">
                <h3 className="font-medium text-card-foreground">Voice Support</h3>
                <p className="text-sm text-muted-foreground">Speak or type your messages</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conversation Starters */}
        <motion.div variants={itemVariants}>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Start Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions?.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion?.prompt)}
                className="p-4 bg-card hover:bg-muted border border-border rounded-lg text-left transition-all duration-200 hover-lift group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                    <Icon 
                      name={suggestion?.icon} 
                      size={20} 
                      className="text-primary" 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground mb-1">
                      {suggestion?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {suggestion?.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div variants={itemVariants} className="mt-8 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-muted-foreground">
                <strong>Pro tip:</strong> You can use voice input by clicking the microphone icon, 
                or press Shift+Enter to add line breaks in your messages.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;