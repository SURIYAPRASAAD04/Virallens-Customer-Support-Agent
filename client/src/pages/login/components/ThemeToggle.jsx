import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ThemeToggle = ({ theme, onThemeToggle }) => {
  return (
    <motion.div
      className="absolute top-6 right-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onThemeToggle}
        className="hover-lift focus-ring"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;