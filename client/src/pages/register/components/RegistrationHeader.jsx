import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const RegistrationHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="text-center mb-8"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center space-x-3 mb-6"
      >
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Zap" size={28} color="white" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Virallens Agent
        </h1>
      </motion.div>
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-xl font-semibold text-foreground">
          Welcome to the Future of Customer Support
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create your account to access AI-powered conversations, persistent chat history, and personalized support experiences.
        </p>
      </motion.div>
      {/* Feature Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span>AI-Powered</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className="text-primary" />
          <span>24/7 Available</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationHeader;