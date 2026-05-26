"use client";

import { useState } from "react";
import { 
  ChevronDown, ChevronUp, Search, MoreHorizontal, 
  Edit, Eye, Trash2, CheckSquare, Square
} from "lucide-react";
import EmptyState from "./EmptyState";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyStateIcon?: any;
  emptyStateTitle?: string;
  emptyStateDesc?: string;
  emptyStateAction?: { label: string; onClick: () => void };
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onEdit,
  onView,
  onDelete,
  emptyStateIcon,
  emptyStateTitle = "No data found",
  emptyStateDesc = "There are no records to display at this time.",
  emptyStateAction,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort
  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  if (data.length === 0) {
    return (
      <EmptyState 
        icon={emptyStateIcon} 
        title={emptyStateTitle} 
        description={emptyStateDesc} 
        action={emptyStateAction} 
      />
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-card border border-border flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-primary bg-primary-light px-3 py-1.5 rounded-md text-primary">
              {selectedIds.size} selected
            </span>
            <button className="text-sm bg-border hover:bg-border-strong text-text-primary px-3 py-1.5 rounded-md font-medium transition-colors">
              Bulk Action
            </button>
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background text-text-muted text-xs uppercase border-b border-border">
            <tr>
              <th className="px-4 py-3 w-10">
                <button onClick={toggleSelectAll} className="text-text-muted hover:text-text-primary transition-colors">
                  {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-primary" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`px-4 py-3 font-medium ${col.sortable !== false ? 'cursor-pointer hover:bg-border/50' : ''} transition-colors`}
                  onClick={() => col.sortable !== false && handleSort(col.accessorKey as string)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && sortConfig?.key === col.accessorKey && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onView || onDelete) && (
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-border last:border-0 hover:bg-background/60 transition-colors group"
              >
                <td className="px-4 py-3">
                  <button onClick={() => toggleSelect(item.id)} className="text-text-muted hover:text-text-primary transition-colors">
                    {selectedIds.has(item.id) ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </td>
                {columns.map((col, i) => (
                  <td key={i} className="px-4 py-3 text-text-primary">
                    {col.cell ? col.cell(item) : (item as any)[col.accessorKey]}
                  </td>
                ))}
                
                {(onEdit || onView || onDelete) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onView && (
                        <button onClick={() => onView(item)} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary-light rounded transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(item)} className="p-1.5 text-text-muted hover:text-role-teacher hover:bg-role-teacher/10 rounded transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)} className="p-1.5 text-text-muted hover:text-status-danger-text hover:bg-status-danger-bg rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {paginatedData.length === 0 && (
          <div className="p-8 text-center text-text-secondary text-sm">
            No results found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div>
            Showing <span className="font-medium text-text-primary">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-text-primary">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium text-text-primary">{filteredData.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-border rounded-md disabled:opacity-50 hover:bg-background transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-border rounded-md disabled:opacity-50 hover:bg-background transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
