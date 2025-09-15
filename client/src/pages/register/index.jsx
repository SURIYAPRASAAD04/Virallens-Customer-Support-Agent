import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const tokenData = JSON.parse(atob(token?.split('.')?.[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenData?.exp > currentTime) {
          navigate('/chat-dashboard', { replace: true });
        }
      } catch (error) {
       
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Register - Virallens Agent</title>
        <meta name="description" content="Create your account to access AI-powered customer support conversations with persistent chat history and personalized experiences." />
        <meta name="keywords" content="register, signup, AI chat, customer support, account creation" />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        {/* Main Content */}
        <div className="relative flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-lg"
          >
            {/* Header Section */}
            <RegistrationHeader />

            {/* Registration Form */}
            <RegistrationForm />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative py-6 px-4 text-center border-t border-border bg-card/50"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
            <p>
              &copy; {new Date()?.getFullYear()} Virallens Agent. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-primary transition-colors duration-150">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-150">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary transition-colors duration-150">
                Support
              </a>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default RegisterPage;