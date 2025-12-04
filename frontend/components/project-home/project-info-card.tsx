'use client';

import * as React from 'react';
import { MapPin, Phone, Calendar, DollarSign, Building2, Users } from 'lucide-react';
import { ProjectInfo } from '@/types/project-home';
import { cn } from '@/lib/utils';

interface ProjectInfoCardProps {
  project: ProjectInfo;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function ProjectInfoCard({ project }: ProjectInfoCardProps) {
  const stageColors: Record<string, string> = {
    'Bid': 'bg-purple-100 text-purple-700',
    'Preconstruction': 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Warranty': 'bg-orange-100 text-orange-700',
    'Complete': 'bg-green-100 text-green-700',
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
          <p className="text-sm text-gray-500">#{project.projectNumber}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded',
              project.status === 'Active'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {project.status}
          </span>
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded',
              stageColors[project.stage] || 'bg-gray-100 text-gray-600'
            )}
          >
            {project.stage}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Location */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Location</p>
            <p className="text-sm text-gray-600">
              {project.address}
              <br />
              {project.city}, {project.state} {project.zip}
            </p>
          </div>
        </div>

        {/* Phone */}
        {project.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-sm text-gray-600">{project.phone}</p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-start gap-3">
          <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Schedule</p>
            <p className="text-sm text-gray-600">
              {formatDate(project.startDate)} - {formatDate(project.estimatedCompletionDate)}
            </p>
          </div>
        </div>

        {/* Project Value */}
        {project.projectValue && (
          <div className="flex items-start gap-3">
            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Project Value</p>
              <p className="text-sm text-gray-600">{formatCurrency(project.projectValue)}</p>
            </div>
          </div>
        )}

        {/* Owner */}
        {project.owner && (
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Owner</p>
              <p className="text-sm text-gray-600">{project.owner}</p>
            </div>
          </div>
        )}

        {/* Type */}
        <div className="flex items-start gap-3">
          <Users className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Type</p>
            <p className="text-sm text-gray-600">{project.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
