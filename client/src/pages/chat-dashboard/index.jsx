import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typewriter } from 'react-simple-typewriter'
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import ConversationSidebar from './components/ConversationSidebar';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import WelcomeScreen from './components/WelcomeScreen';

const API_BASE_URL = 'https://virallens-agent.onrender.com';

const ChatDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [hasLoadedInitialConversation, setHasLoadedInitialConversation] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTheme = localStorage.getItem('theme') || 'light';
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    
    setTheme(storedTheme);
    document.documentElement?.classList?.toggle('dark', storedTheme === 'dark');
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData?.id) {
        console.error('User ID not found');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/conversations/${userData.id}?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data.conversations);

      const resumeConversationId = searchParams.get('resume');
      if (resumeConversationId) {
        await loadConversation(resumeConversationId);
        setHasLoadedInitialConversation(true);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };
  
  const loadConversation = async (conversationId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}/api/conversations/single/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      const conversation = await response.json();
      setActiveConversationId(conversationId);
      setActiveConversation(conversation);
      setMessages(conversation.messages || []);
      setHasLoadedInitialConversation(true);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement?.classList?.toggle('dark', newTheme === 'dark');
  };

  const handleConversationSelect = async (conversationId) => {
    await loadConversation(conversationId);
    setIsMobileSidebarOpen(false);
  };

  const handleNewConversation = () => {
    const newConversationId = `conv-${Date.now()}`;
    setActiveConversationId(newConversationId);
    setActiveConversation({
      conversation_id: newConversationId,
      title: 'New Conversation',
      preview: 'Start a new conversation...',
      messages: []
    });
    setMessages([]);
    setIsMobileSidebarOpen(false);
    setHasLoadedInitialConversation(true);
    
    setConversations(prev => [{
      conversation_id: newConversationId,
      title: 'New Conversation',
      preview: 'Start a new conversation...',
      messageCount: 0,
      updatedAt: new Date()
    }, ...prev]);
  };

  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim()) return;

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('authToken');
    const userMessage = {
      id: `msg-${Date.now()}`,
      content: messageContent,
      isUser: true,
      timestamp: new Date()
    };

   
    if (!activeConversationId && messages.length === 0) {
      handleNewConversation();
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages,
          conversationId: activeConversationId,
          userId: userData.id,
          title: activeConversation?.title || 'New Conversation'
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

     
      setMessages(prev => [...prev, aiMessage]);
      
     
      if (data.conversationId && data.conversationId !== activeConversationId) {
        setActiveConversationId(data.conversationId);
        setActiveConversation(prev => ({
          ...prev,
          conversation_id: data.conversationId
        }));
      }

     
      refreshConversationsList();
      
    } catch (error) {
      console.error('Error sending message:', error);
     
      const fallbackResponse = "I'm having trouble connecting right now. Please try again later.";
      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        content: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  
  const refreshConversationsList = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('authToken');
      
      if (!userData?.id || !token) return;

      const response = await fetch(`${API_BASE_URL}/api/conversations/${userData.id}?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  };

  const handleClearChat = () => {
    if (activeConversationId) {
      setMessages([]);
      
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === activeConversationId 
          ? { ...conv, preview: 'Start a new conversation...' }
          : conv
      ));
    }
  };

  const handleCopyMessage = (message) => {
    navigator.clipboard.writeText(message);
  };

  const handleRegenerateResponse = () => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.isUser);
      if (lastUserMessage) {
     
        const messagesWithoutLastAI = messages.filter((msg, index) => 
          index !== messages.length - 1 || msg.isUser
        );
        setMessages(messagesWithoutLastAI);
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  const handleSpeakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speech);
    }
  };

  const handleMessageUpdate = (messageId, newContent) => {
    setMessages(prev => prev.map(msg => 
      (msg._id === messageId || msg.id === messageId) 
        ? { ...msg, content: newContent }
        : msg
    ));
  };

  const hasMessages = messages.length > 0;
  const showWelcomeScreen = !hasLoadedInitialConversation && !isLoading && messages.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation
        user={user}
        onLogout={handleLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <div className="pt-16 h-screen flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-300"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-80 h-full bg-card border-r border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <ConversationSidebar
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onConversationSelect={handleConversationSelect}
                  onNewConversation={handleNewConversation}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat Header */}
          <ChatHeader
            conversationTitle={activeConversation?.title || (showWelcomeScreen ? 'AI Assistant' : 'New Conversation')}
            isOnline={true}
            onClearChat={handleClearChat}
            onToggleTheme={handleThemeToggle}
            theme={theme}
            onToggleSidebar={() => setIsMobileSidebarOpen(true)}
            isSidebarCollapsed={isSidebarCollapsed}
            conversationId={activeConversationId}
            onTitleUpdate={(newTitle) => {
              setActiveConversation(prev => ({ ...prev, title: newTitle }));
              setConversations(prev => prev.map(conv => 
                conv.conversation_id === activeConversationId 
                  ? { ...conv, title: newTitle }
                  : conv
              ));
            }}
          />

          {/* Breadcrumb */}
          <div className="px-6 pt-4">
            <NavigationBreadcrumb />
          </div>

          {/* Chat Messages Area */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : showWelcomeScreen ? (
              <WelcomeScreen
                onStartConversation={handleSendMessage}
                userName={user?.fullName || user?.name || 'there'} 
              />
            ) : !hasMessages ? (
              <div className="flex items-center justify-center h-full">
                 <div className="text-center text-foreground text-2xl font-bold">
                  <p>
                    <Typewriter
                      words={["I'm your AI Powered Customer Support Agent, How can I help you today?"]}
                      loop={1} 
                      cursor
                      cursorStyle="|"
                      typeSpeed={50}
                      deleteSpeed={50}
                      delaySpeed={1000}
                    />
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <ChatMessage
                      key={message.id || message._id || `msg-${index}`}
                      message={message.content}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                      onCopy={() => handleCopyMessage(message.content)}
                      onRegenerate={handleRegenerateResponse}
                      onSpeak={() => handleSpeakMessage(message.content)}
                      messageId={message._id || message.id}
                      conversationId={activeConversationId}
                      onMessageUpdate={handleMessageUpdate}
                    />
                  ))}
                </AnimatePresence>

                <TypingIndicator isVisible={isTyping} />
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;