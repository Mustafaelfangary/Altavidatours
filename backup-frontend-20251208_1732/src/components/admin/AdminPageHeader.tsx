import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  onAddNew?: () => void;
  onRefresh?: () => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: {
    label: string;
    value: string;
  }[];
  onFilterChange?: (value: string) => void;
  filterLabel?: string;
  filterValue?: string;
  showAddButton?: boolean;
  showRefreshButton?: boolean;
  showSearch?: boolean;
  showFilter?: boolean;
  showExportButton?: boolean;
  onExport?: () => void;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  onAddNew,
  onRefresh,
  onSearch,
  searchPlaceholder = 'Search...',
  filterOptions = [],
  onFilterChange,
  filterLabel = 'Filter',
  filterValue = '',
  showAddButton = true,
  showRefreshButton = true,
  showSearch = true,
  showFilter = true,
  showExportButton = false,
  onExport,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        {showSearch && onSearch && (
          <div className="relative">
            <Input
              placeholder={searchPlaceholder}
              className="w-full sm:w-64"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
        
        {showFilter && onFilterChange && filterOptions.length > 0 && (
          <Select onValueChange={onFilterChange} value={filterValue}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={`${filterLabel}...`} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {showRefreshButton && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        {showExportButton && onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
        
        {showAddButton && onAddNew && (
          <Button onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
        
        {children}
      </div>
    </div>
  );
}
