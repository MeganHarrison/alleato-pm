'use client';

import * as React from 'react';
import { ProjectOverviewItem } from '@/types/project-home';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentMetadataModal } from './document-metadata-modal';

interface ProjectOverviewProps {
  items: ProjectOverviewItem[];
  projectId: string;
}

function OverviewBar({ item }: { item: ProjectOverviewItem }) {
  const total = item.overdue + item.nextSevenDays + item.moreThanSevenDays;
  if (total === 0) return <span className="text-gray-400">-</span>;

  const overduePercent = (item.overdue / total) * 100;
  const nextSevenPercent = (item.nextSevenDays / total) * 100;
  const openPercent = (item.moreThanSevenDays / total) * 100;

  return (
    <div className="flex h-6 rounded overflow-hidden text-xs font-medium">
      {item.overdue > 0 && (
        <div
          className="bg-red-500 text-white flex items-center justify-center"
          style={{ width: `${overduePercent}%`, minWidth: item.overdue > 0 ? '24px' : 0 }}
        >
          {item.overdue}
        </div>
      )}
      {item.nextSevenDays > 0 && (
        <div
          className="bg-yellow-500 text-white flex items-center justify-center"
          style={{ width: `${nextSevenPercent}%`, minWidth: item.nextSevenDays > 0 ? '24px' : 0 }}
        >
          {item.nextSevenDays}
        </div>
      )}
      {item.moreThanSevenDays > 0 && (
        <div
          className="bg-green-500 text-white flex items-center justify-center"
          style={{ width: `${openPercent}%`, minWidth: item.moreThanSevenDays > 0 ? '24px' : 0 }}
        >
          {item.moreThanSevenDays}
        </div>
      )}
    </div>
  );
}

export function ProjectOverview({ items, projectId }: ProjectOverviewProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<ProjectOverviewItem | null>(null);

  const handleItemClick = (item: ProjectOverviewItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Project Overview</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Overview</TableHead>
              <TableHead>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-red-500"></span>
                    <span>Overdue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-yellow-500"></span>
                    <span>Next 7 Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-500"></span>
                    <span>&gt; 7 Days</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-right">Total Open</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <button
                    onClick={() => handleItemClick(item)}
                    className="text-blue-600 hover:underline font-medium text-left"
                  >
                    {item.name}
                  </button>
                </TableCell>
                <TableCell>
                  <OverviewBar item={item} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.totalOpen}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  No overview items
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentMetadataModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedItem?.name || 'Documents'}
        projectId={projectId}
      />
    </>
  );
}
