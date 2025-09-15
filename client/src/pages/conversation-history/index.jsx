import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import NavigationBreadcrumb from '../../components/ui/NavigationBreadcrumb';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import FilterControls from './components/FilterControls';
import ConversationList from './components/ConversationList';
import BulkActionToolbar from './components/BulkActionToolbar';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import PaginationControls from './components/PaginationControls';
import Icon from '../../components/AppIcon';

const ConversationHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [conversations, setConversations] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [conversationType, setConversationType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    conversationIds: [],
    count: 0
  });

  useEffect(() => {
    const initializeComponent = async () => {
      try {
       
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);

        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement?.classList?.toggle('dark', savedTheme === 'dark');


        await loadConversations();
      } catch (error) {
        console.error('Error initializing conversation history:', error);
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, [currentPage, itemsPerPage, searchTerm, dateRange, conversationType, sortBy]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData?.id) {
        console.error('User ID not found');
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm,
        dateRange,
        conversationType,
        sortBy
      });

      const response = await fetch(`https://virallens-agent.onrender.com/api/conversations/${userData.id}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      
      setConversations(data.conversations);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement?.classList?.toggle('dark', newTheme === 'dark');
  };

  const handleSelectConversation = (conversationId, isSelected) => {
    setSelectedConversations(prev => 
      isSelected 
        ? [...prev, conversationId]
        : prev.filter(id => id !== conversationId)
    );
  };

  const handleSelectAll = () => {
    setSelectedConversations(conversations.map(conv => conv.conversation_id));
  };

  const handleDeselectAll = () => {
    setSelectedConversations([]);
  };

  const handleResumeConversation = (conversationId) => {
    navigate(`/chat-dashboard?resume=${conversationId}`);
  };

  const handleDeleteConversation = (conversationId) => {
    setDeleteModal({
      isOpen: true,
      conversationIds: [conversationId],
      count: 1
    });
  };

  const handleBulkDelete = () => {
    setDeleteModal({
      isOpen: true,
      conversationIds: selectedConversations,
      count: selectedConversations.length
    });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch('https://virallens-agent.onrender.com/api/conversations/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationIds: deleteModal.conversationIds
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete conversations');
      }

    
      await loadConversations();
      
   
      setSelectedConversations([]);
      
      setDeleteModal({ isOpen: false, conversationIds: [], count: 0 });
    } catch (error) {
      console.error('Error deleting conversations:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkExport = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        conversations: []
      };

      for (const conversationId of selectedConversations) {
        const response = await fetch(`https://virallens-agent.onrender.com/api/conversations/single/${conversationId}`);
        if (response.ok) {
          const conversation = await response.json();
          exportData.conversations.push(conversation);
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversations-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSelectedConversations([]);
    } catch (error) {
      console.error('Error exporting conversations:', error);
    }
  };

  const handleBulkArchive = () => {
    console.log('Archiving conversations:', selectedConversations);
    setSelectedConversations([]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateRange('all');
    setConversationType('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <AuthenticationGuard>
      <div className="min-h-screen bg-background">
        <HeaderNavigation
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />

        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <NavigationBreadcrumb />
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Conversation History</h1>
                  <p className="text-muted-foreground mt-2">
                    {totalCount} conversations found
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/chat-dashboard')}
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 focus-ring"
                  >
                    <Icon name="Plus" size={16} />
                    <span>New Chat</span>
                  </button>
                </div>
              </div>
            </div>

            <FilterControls
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              conversationType={conversationType}
              onConversationTypeChange={setConversationType}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              onClearFilters={handleClearFilters}
              totalResults={totalCount}
            />

            <ConversationList
              conversations={conversations}
              selectedConversations={selectedConversations}
              onSelectConversation={handleSelectConversation}
              onResumeConversation={handleResumeConversation}
              onDeleteConversation={handleDeleteConversation}
              searchTerm={searchTerm}
              isLoading={isLoading}
            />

            {!isLoading && totalCount > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            )}
          </div>
        </main>

        <BulkActionToolbar
          selectedCount={selectedConversations.length}
          totalCount={conversations.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onBulkArchive={handleBulkArchive}
          isVisible={selectedConversations.length > 0}
        />

        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, conversationIds: [], count: 0 })}
          onConfirm={confirmDelete}
          conversationCount={deleteModal.count}
          isDeleting={isDeleting}
        />
      </div>
    </AuthenticationGuard>
  );
};

export default ConversationHistory;