import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  dateRange, 
  onDateRangeChange,
  conversationType,
  onConversationTypeChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  totalResults
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const conversationTypeOptions = [
    { value: 'all', label: 'All Conversations' },
    { value: 'support', label: 'Customer Support' },
    { value: 'general', label: 'General Chat' },
    { value: 'technical', label: 'Technical Help' },
    { value: 'feedback', label: 'Feedback & Suggestions' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'duration', label: 'Longest Duration' },
    { value: 'messages', label: 'Most Messages' },
    { value: 'relevance', label: 'Most Relevant' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const hasActiveFilters = searchTerm || dateRange !== 'all' || conversationType !== 'all' || sortBy !== 'newest';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search conversations by content, date, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            iconName={isAdvancedOpen ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            Advanced Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconSize={16}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={dateRange}
              onChange={onDateRangeChange}
              className="w-full"
            />
            
            <Select
              label="Conversation Type"
              options={conversationTypeOptions}
              value={conversationType}
              onChange={onConversationTypeChange}
              className="w-full"
            />
            
            <Select
              label="Sort By"
              options={sortOptions}
              value={sortBy}
              onChange={onSortByChange}
              className="w-full"
            />
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                className="w-full"
              />
              <Input
                type="date"
                label="End Date"
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
      {/* Results Summary */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {totalResults > 0 ? (
            <>
              Showing <span className="font-medium text-foreground">{totalResults}</span> conversation{totalResults !== 1 ? 's' : ''}
              {searchTerm && (
                <> matching "<span className="font-medium text-foreground">{searchTerm}</span>"</>
              )}
            </>
          ) : (
            'No conversations found'
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="xs"
            iconName="Download"
            iconSize={14}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="xs"
            iconName="Archive"
            iconSize={14}
          >
            Archive
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;