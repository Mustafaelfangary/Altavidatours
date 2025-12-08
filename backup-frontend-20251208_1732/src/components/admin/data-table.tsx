"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';

type ColumnDef<T> = {
  accessorKey?: keyof T;
  id?: string;
  header: string;
  cell?: (props: { row: { original: T } }) => React.ReactNode;
  filterable?: boolean;
  sortable?: boolean;
};

interface AdminDataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  searchKey: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (value: string) => void;
  onRowClick?: (row: T) => void;
  addButtonLabel?: string;
  onAddClick?: () => void;
}

export function AdminDataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKey,
  page,
  totalPages,
  onPageChange,
  onSearch,
  onRowClick,
  addButtonLabel,
  onAddClick,
}: AdminDataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  const visibleColumns = useMemo(() => {
    return columns.filter(column => column.id !== 'actions');
  }, [columns]);

  const actionColumn = useMemo(() => {
    return columns.find(column => column.id === 'actions');
  }, [columns]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${searchKey}...`}
              className="pl-8 w-[250px] lg:w-[300px]"
              value={searchValue}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {onAddClick && (
          <Button onClick={onAddClick}>
            {addButtonLabel || 'Add New'}
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead key={column.id || String(column.accessorKey)}>
                  {column.header}
                </TableHead>
              ))}
              {actionColumn && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <TableRow 
                  key={i}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id || String(column.accessorKey)}>
                      {column.cell
                        ? column.cell({ row: { original: row } })
                        : column.accessorKey
                        ? String(row[column.accessorKey])
                        : null}
                    </TableCell>
                  ))}
                  {actionColumn?.cell && (
                    <TableCell>
                      {actionColumn.cell({ row: { original: row } })}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
