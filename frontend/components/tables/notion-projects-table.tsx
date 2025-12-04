"use client";

import { ReactElement, useMemo, useState } from "react";
import { type ProjectData } from "@/utils/notion/projects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, User, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";

interface NotionProjectsTableProps {
  projects: ProjectData[];
}

/**
 * Table component to display Notion projects with proper formatting and styling
 */
export function NotionProjectsTable({ projects }: NotionProjectsTableProps): ReactElement {
  // Pre-compute timestamps for better performance
  const projectsWithTimestamps = useMemo(() => 
    projects.map(project => ({
      ...project,
      lastEditedTimestamp: new Date(project.lastEditedTime).getTime(),
    })), [projects]
  );

  const [sortColumn, setSortColumn] = useState<string>('last_updated')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const getSortValue = (project: typeof projectsWithTimestamps[number], columnId: string) => {
    switch (columnId) {
      case 'name':
        return project.name?.toLowerCase() || ''
      case 'status':
        return project.status?.toLowerCase() || ''
      case 'priority':
        return project.priority?.toLowerCase() || ''
      case 'assignee':
        return project.assignee?.toLowerCase() || ''
      case 'due_date':
        return project.dueDate ? new Date(project.dueDate).getTime() : 0
      case 'description':
        return project.description?.toLowerCase() || ''
      case 'last_updated':
        return project.lastEditedTimestamp
      default:
        return ''
    }
  }

  const sortedProjects = useMemo(() => {
    const sorted = [...projectsWithTimestamps]
    sorted.sort((a, b) => {
      const valueA = getSortValue(a, sortColumn)
      const valueB = getSortValue(b, sortColumn)

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
      }

      return sortDirection === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA))
    })
    return sorted
  }, [projectsWithTimestamps, sortColumn, sortDirection])

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    }

    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    ) : (
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
    )
  }

  const getStatusBadgeVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";
    
    switch (status.toLowerCase()) {
      case "completed":
      case "done":
        return "default";
      case "in progress":
      case "active":
        return "secondary";
      case "blocked":
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityBadgeVariant = (priority: string | null): "default" | "secondary" | "destructive" | "outline" => {
    if (!priority) return "outline";
    
    switch (priority.toLowerCase()) {
      case "high":
      case "urgent":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No projects found in the Notion database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-4 py-2 text-sm text-muted-foreground">
        <span>Total rows: {projects.length}</span>
      </div>
      <div className="rounded-md border">
        <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="w-[300px] cursor-pointer select-none"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center gap-1">
              Project Name
              {renderSortIcon('name')}
            </div>
          </TableHead>
          <TableHead
            className="w-[120px] cursor-pointer select-none"
            onClick={() => handleSort('status')}
          >
            <div className="flex items-center gap-1">
              Status
              {renderSortIcon('status')}
            </div>
          </TableHead>
          <TableHead
            className="w-[100px] cursor-pointer select-none"
            onClick={() => handleSort('priority')}
          >
            <div className="flex items-center gap-1">
              Priority
              {renderSortIcon('priority')}
            </div>
          </TableHead>
          <TableHead
            className="w-[150px] cursor-pointer select-none"
            onClick={() => handleSort('assignee')}
          >
            <div className="flex items-center gap-1">
              Assignee
              {renderSortIcon('assignee')}
            </div>
          </TableHead>
          <TableHead
            className="w-[120px] cursor-pointer select-none"
            onClick={() => handleSort('due_date')}
          >
            <div className="flex items-center gap-1">
              Due Date
              {renderSortIcon('due_date')}
            </div>
          </TableHead>
          <TableHead
            className="w-[200px] cursor-pointer select-none"
            onClick={() => handleSort('description')}
          >
            <div className="flex items-center gap-1">
              Description
              {renderSortIcon('description')}
            </div>
          </TableHead>
          <TableHead
            className="w-[120px] cursor-pointer select-none"
            onClick={() => handleSort('last_updated')}
          >
            <div className="flex items-center gap-1">
              Last Updated
              {renderSortIcon('last_updated')}
            </div>
          </TableHead>
          <TableHead className="w-[80px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span className="truncate">{project.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status || "No Status"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityBadgeVariant(project.priority)}>
                  {project.priority || "No Priority"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {project.assignee ? (
                    <>
                      <User className="h-3 w-3" />
                      <span className="truncate">{project.assignee}</span>
                    </>
                  ) : (
                    "Unassigned"
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {project.dueDate ? (
                    <>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(project.dueDate)}</span>
                    </>
                  ) : (
                    "No due date"
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                  {project.description || "No description"}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(project.lastEditedTime)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (project.url) {
                      const newWindow = window.open(project.url, "_blank", "noopener,noreferrer");
                      if (newWindow) {
                        newWindow.opener = null;
                      }
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open in Notion</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);
}
