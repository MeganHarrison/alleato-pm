'use client';

import * as React from 'react';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';
import { ProjectTeamMember } from '@/types/project-home';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProjectTeamProps {
  team: ProjectTeamMember[];
  projectId: string;
}

export function ProjectTeam({ team, projectId }: ProjectTeamProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Project Team</h2>
        <Link
          href={`/projects/${projectId}/directory/configure`}
          className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1"
        >
          Edit <Edit2 className="w-3 h-3" />
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Office</TableHead>
            <TableHead>Mobile</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.role}</TableCell>
              <TableCell>
                {member.name} ({member.company})
              </TableCell>
              <TableCell>
                <a
                  href={`mailto:${member.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {member.email}
                </a>
              </TableCell>
              <TableCell>{member.office || '-'}</TableCell>
              <TableCell>{member.mobile || '-'}</TableCell>
            </TableRow>
          ))}
          {team.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No team members assigned
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
