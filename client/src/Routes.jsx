import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import LoginPage from './pages/login';
import ChatDashboard from './pages/chat-dashboard';
import ConversationHistory from './pages/conversation-history';
import UserProfile from './pages/user-profile';
import RegisterPage from './pages/register';
import AuthenticationGuard from "./components/ui/AuthenticationGuard";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/chat-dashboard" 
          element={
            <AuthenticationGuard>
              <ChatDashboard />
            </AuthenticationGuard>
          } 
        />
        <Route path="/conversation-history" element={
          <AuthenticationGuard>
            <ConversationHistory />
          </AuthenticationGuard>
        } />
        <Route path="/user-profile" element={
          <AuthenticationGuard>
            <UserProfile />
          </AuthenticationGuard>
        } />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
