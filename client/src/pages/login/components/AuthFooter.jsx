import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthFooter = () => {
  return (
    <motion.div
      className="text-center mt-8 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <span>Don't have an account?</span>
        <Link
          to="/register"
          className="text-primary hover:text-primary/80 font-medium transition-colors duration-150 hover:underline"
        >
          Create Account
        </Link>
      </div>
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </motion.div>
  );
};

export default AuthFooter;