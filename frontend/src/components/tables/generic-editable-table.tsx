'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface EditableColumn<T> {
  key: keyof T;
  header: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select';
  width?: string;
  editable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  selectOptions?: { value: string; label: string }[];
}

interface GenericEditableTableProps<T extends { id: string | number }> {
  data: T[];
  columns: EditableColumn<T>[];
  onUpdate?: (id: string | number, data: Partial<T>) => Promise<{ error?: string }>;
  onDelete?: (id: string | number) => Promise<{ error?: string }>;
  className?: string;
}

export function GenericEditableTable<T extends { id: string | number }>({
  data,
  columns,
  onUpdate,
  onDelete,
  className,
}: GenericEditableTableProps<T>) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editData, setEditData] = useState<Partial<T>>({});
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = (row: T) => {
    setEditingId(row.id);
    const editableData: Partial<T> = {};
    columns.forEach((col) => {
      if (col.editable !== false) {
        editableData[col.key] = row[col.key];
      }
    });
    setEditData(editableData);
  };

  const handleSave = async (id: string | number) => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    try {
      const { error } = await onUpdate(id, editData);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Updated successfully');
        setEditingId(null);
        setEditData({});
      }
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id: string | number) => {
    if (!onDelete) return;
    
    setIsDeleting(id);
    try {
      const { error } = await onDelete(id);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(null);
    }
  };

  const renderEditableCell = (column: EditableColumn<T>, value: any) => {
    const commonProps = {
      value: editData[column.key] ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setEditData((prev) => ({ ...prev, [column.key]: e.target.value })),
    };

    switch (column.type) {
      case 'textarea':
        return <Textarea {...commonProps} className="min-h-[60px]" />;
      case 'select':
        return (
          <select
            value={editData[column.key] as string}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, [column.key]: e.target.value }))
            }
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {column.selectOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return <Input type={column.type || 'text'} {...commonProps} />;
    }
  };

  return (
    <div className={cn("rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={column.width}
              >
                {column.header}
              </TableHead>
            ))}
            {(onUpdate || onDelete) && (
              <TableHead className="w-[100px] text-center">
                <div className="flex items-center justify-center gap-1">
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const isEditing = editingId === row.id;
            const isCurrentlyDeleting = isDeleting === row.id;

            return (
              <TableRow key={String(row.id)} className="group hover:bg-muted/50 transition-colors cursor-pointer">
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {isEditing && column.editable !== false ? (
                      renderEditableCell(column, row[column.key])
                    ) : column.render ? (
                      column.render(row[column.key], row)
                    ) : (
                      String(row[column.key] ?? '-')
                    )}
                  </TableCell>
                ))}
                {(onUpdate || onDelete) && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSave(row.id)}
                            disabled={isSaving}
                            className="h-8 w-8 p-0"
                          >
                            {isSaving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          {onUpdate && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(row)}
                              disabled={isCurrentlyDeleting}
                              className="h-8 w-8 p-0 opacity-30 group-hover:opacity-100 transition-opacity"
                              title="Edit row"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(row.id)}
                              disabled={isCurrentlyDeleting}
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete row"
                            >
                              {isCurrentlyDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4 text-red-500" />
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}