import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TypingIndicator = ({ isVisible }) => {
  if (!isVisible) return null;

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-4, 0, -4],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-4"
    >
      <div className="flex items-end space-x-2">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
          <Icon name="Bot" size={16} />
        </div>

        {/* Typing Bubble */}
        <div className="bg-card text-card-foreground border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground mr-2">Agent is typing</span>
            <div className="flex space-x-1">
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                className="w-2 h-2 bg-primary rounded-full"
                style={{ animationDelay: '0ms' }}
              />
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                className="w-2 h-2 bg-primary rounded-full"
                style={{ animationDelay: '200ms' }}
              />
              <motion.div
                variants={dotVariants}
                initial="initial"
                animate="animate"
                className="w-2 h-2 bg-primary rounded-full"
                style={{ animationDelay: '400ms' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;