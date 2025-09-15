import React from 'react';
import Icon from '../../../components/AppIcon';


const ProfileHeader = ({ user, isEditing, onEditToggle }) => {
  const userInitials = user?.name 
    ? user?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()?.slice(0, 2)
    : user?.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-subtle">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-semibold">
              {userInitials}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors duration-200 elevation-subtle">
              <Icon name="Camera" size={16} color="white" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground mb-1">
              {user?.name || 'User Profile'}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Active since {new Date()?.getFullYear() - 1}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onEditToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover-lift ${
            isEditing 
              ? 'bg-success text-success-foreground' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          <Icon name={isEditing ? 'Check' : 'Edit'} size={16} />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MessageSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">Total Conversations</span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">247</p>
          <p className="text-xs text-muted-foreground">+12 this week</p>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-sm font-medium text-card-foreground">Active Time</span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">42h</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="text-sm font-medium text-card-foreground">Satisfaction</span>
          </div>
          <p className="text-2xl font-semibold text-card-foreground">4.8</p>
          <p className="text-xs text-muted-foreground">Average rating</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;