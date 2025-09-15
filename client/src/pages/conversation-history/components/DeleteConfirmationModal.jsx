import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  conversationCount = 1,
  isDeleting = false 
}) => {
  if (!isOpen) return null;

  const isMultiple = conversationCount > 1;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-300 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-md w-full p-6 elevation-prominent animate-scale-in">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">
              Delete Conversation{isMultiple ? 's' : ''}
            </h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete {isMultiple ? `these ${conversationCount} conversations` : 'this conversation'}? 
            All messages and associated data will be permanently removed from your account.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            loading={isDeleting}
            iconName="Trash2"
            iconSize={16}
          >
            {isDeleting ? 'Deleting...' : `Delete ${isMultiple ? 'Conversations' : 'Conversation'}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;