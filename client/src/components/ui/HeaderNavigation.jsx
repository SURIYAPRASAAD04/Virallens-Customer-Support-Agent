import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const HeaderNavigation = ({ user, onLogout, theme, onThemeToggle }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/chat-dashboard',
      icon: 'MessageSquare',
      requiresAuth: true
    },
    {
      label: 'History',
      path: '/conversation-history',
      icon: 'History',
      requiresAuth: true
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleLogout = () => {
    onLogout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    onThemeToggle();
    setIsUserDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const getUserDisplayName = () => {
    return user?.fullName || user?.name || user?.email?.split('@')[0] || 'User';
  };

 
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  const getUserEmail = () => {
    return user?.email || 'No email provided';
  };

  const Logo = () => (
    <Link to="/chat-dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Zap" size={20} color="white" strokeWidth={2.5} />
      </div>
      <span className="text-xl font-semibold text-foreground">Virallens Agent</span>
    </Link>
  );

  const UserAvatar = ({ size = 8, showName = false, className = '' }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-${size} h-${size} bg-primary rounded-full flex items-center justify-center text-white font-medium text-xs`}>
        {getUserInitials()}
      </div>
      {showName && (
        <span className="text-sm font-medium text-foreground">
          {getUserDisplayName()}
        </span>
      )}
    </div>
  );

  const UserDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        className="flex items-center space-x-2 hover:bg-muted"
      >
        <UserAvatar size={8} />
        <span className="hidden md:block text-sm font-medium text-foreground">
          {getUserDisplayName()}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} 
        />
      </Button>

      {isUserDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg elevation-moderate z-200 animate-slide-in-from-top">
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3 mb-2">
              <UserAvatar size={10} />
            </div>
            <p className="text-sm font-medium text-popover-foreground">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">{getUserEmail()}</p>
          </div>
          
          <div className="p-1">
           
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} />
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
             <button
              onClick={handleProfileClick}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md transition-colors duration-150"
            >
              <Icon name="Settings" size={16} />
              <span>Settings - Coming Soon</span>
            </button>
            
            
            <div className="border-t border-border my-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-150"
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-100">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground elevation-subtle'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <UserDropdown />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-300 md:hidden">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Logo />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground elevation-subtle'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="px-4 py-6 border-t border-border space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3">
                <UserAvatar size={10} />
                <div>
                  <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">{getUserEmail()}</p>
                  {user?.role && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-1">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="User" size={20} />
                <span className="text-base font-medium">My Profile</span>
              </button>

              <button
                onClick={handleProfileClick}
                className="w-full flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name="Settings" size={20} />
                <span className="text-base font-medium">Settings</span>
              </button>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-muted rounded-lg transition-colors duration-150"
              >
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
                <span className="text-base font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-150"
              >
                <Icon name="LogOut" size={20} />
                <span className="text-base font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderNavigation;