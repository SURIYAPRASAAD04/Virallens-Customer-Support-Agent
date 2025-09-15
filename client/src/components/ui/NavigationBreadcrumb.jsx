import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumb = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const routeLabels = {
    '/chat-dashboard': 'Dashboard',
    '/conversation-history': 'Conversation History',
    '/user-profile': 'Profile Settings',
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [];

   
    breadcrumbs?.push({
      label: 'Dashboard',
      path: '/chat-dashboard',
      isActive: false
    });

   
    if (location?.pathname !== '/chat-dashboard') {
      const currentLabel = routeLabels?.[location?.pathname] || 'Page';
      breadcrumbs?.push({
        label: currentLabel,
        path: location?.pathname,
        isActive: true
      });
    } else {
      
      breadcrumbs[0].isActive = true;
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();


  if (breadcrumbs?.length === 1 && breadcrumbs?.[0]?.isActive) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground/60" 
              />
            )}
            
            {crumb?.isActive ? (
              <span className="text-foreground font-medium" aria-current="page">
                {crumb?.label}
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="hover:text-primary transition-colors duration-150 hover:underline"
              >
                {crumb?.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumb;