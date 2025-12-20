'use client';

import { useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type ColumnMetadata } from '@/server/db/introspection';

interface ColumnPickerProps {
  columns: ColumnMetadata[];
  visibleColumns: string[];
  onVisibleColumnsChange: (columns: string[]) => void;
}

export function ColumnPicker({
  columns,
  visibleColumns,
  onVisibleColumnsChange,
}: ColumnPickerProps) {
  const [open, setOpen] = useState(false);

  const toggleColumn = (columnName: string) => {
    if (visibleColumns.includes(columnName)) {
      onVisibleColumnsChange(visibleColumns.filter((c) => c !== columnName));
    } else {
      onVisibleColumnsChange([...visibleColumns, columnName]);
    }
  };

  const showAll = () => {
    onVisibleColumnsChange(columns.map((c) => c.column_name));
  };

  const hideAll = () => {
    // Keep at least the first column visible
    const firstColumn = columns[0]?.column_name;
    onVisibleColumnsChange(firstColumn ? [firstColumn] : []);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Columns3 className="h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex gap-2 px-2 py-1.5">
          <Button variant="ghost" size="sm" onClick={showAll} className="flex-1 text-xs">
            Show all
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAll} className="flex-1 text-xs">
            Hide all
          </Button>
        </div>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.column_name}
            checked={visibleColumns.includes(column.column_name)}
            onCheckedChange={() => toggleColumn(column.column_name)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
