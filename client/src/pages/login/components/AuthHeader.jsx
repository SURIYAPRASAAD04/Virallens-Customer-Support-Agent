import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AuthHeader = () => {
  return (
    <motion.div
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex justify-center mb-6">
        <motion.div
          className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center elevation-moderate"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon name="Zap" size={32} color="white" strokeWidth={2.5} />
        </motion.div>
      </div>
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Welcome back
      </h1>
      <p className="text-muted-foreground">
        Sign in to your Virallens Agent account to continue your AI conversations
      </p>
    </motion.div>
  );
};

export default AuthHeader;