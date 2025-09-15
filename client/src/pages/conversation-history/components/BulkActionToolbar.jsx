import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionToolbar = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport, 
  onBulkArchive,
  isVisible 
}) => {
  if (!isVisible || selectedCount === 0) return null;

  const isAllSelected = selectedCount === totalCount;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg elevation-prominent p-4 z-50 animate-slide-in-from-bottom">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="Check" size={16} color="white" />
          </div>
          <span className="text-sm font-medium text-card-foreground">
            {selectedCount} conversation{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="h-6 w-px bg-border"></div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            iconName={isAllSelected ? "Square" : "CheckSquare"}
            iconSize={14}
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={onBulkExport}
            iconName="Download"
            iconSize={14}
          >
            Export
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={onBulkArchive}
            iconName="Archive"
            iconSize={14}
          >
            Archive
          </Button>

          <Button
            variant="destructive"
            size="xs"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconSize={14}
          >
            Delete
          </Button>
        </div>

        <div className="h-6 w-px bg-border"></div>

        <Button
          variant="ghost"
          size="xs"
          onClick={onDeselectAll}
          iconName="X"
          iconSize={14}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BulkActionToolbar;