'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/tables/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Cloud, CloudRain, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DailyLogEntry {
  id: string;
  date: string;
  weather: 'sunny' | 'cloudy' | 'rainy';
  tempHigh: number;
  tempLow: number;
  workPerformed: string;
  manpower: number;
  createdBy: string;
  status: 'draft' | 'submitted' | 'approved';
}

const mockDailyLogs: DailyLogEntry[] = [
  {
    id: '1',
    date: '2025-12-10',
    weather: 'sunny',
    tempHigh: 72,
    tempLow: 55,
    workPerformed: 'Concrete pour for foundation, framing crew started second floor',
    manpower: 24,
    createdBy: 'Site Superintendent',
    status: 'submitted',
  },
  {
    id: '2',
    date: '2025-12-09',
    weather: 'cloudy',
    tempHigh: 68,
    tempLow: 52,
    workPerformed: 'Electrical rough-in, HVAC ductwork installation',
    manpower: 18,
    createdBy: 'Site Superintendent',
    status: 'approved',
  },
];

const WeatherIcon = ({ weather }: { weather: string }) => {
  switch (weather) {
    case 'sunny':
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case 'cloudy':
      return <Cloud className="h-4 w-4 text-gray-500" />;
    case 'rainy':
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    default:
      return <Cloud className="h-4 w-4" />;
  }
};

export default function DailyLogPage() {
  const [data, setData] = React.useState<DailyLogEntry[]>(mockDailyLogs);

  const columns: ColumnDef<DailyLogEntry>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <button
          type="button"
          className="font-medium text-[hsl(var(--procore-orange))] hover:underline"
        >
          {new Date(row.getValue('date')).toLocaleDateString()}
        </button>
      ),
    },
    {
      accessorKey: 'weather',
      header: 'Weather',
      cell: ({ row }) => {
        const weather = row.getValue('weather') as string;
        return (
          <div className="flex items-center gap-2">
            <WeatherIcon weather={weather} />
            <span className="capitalize">{weather}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'tempHigh',
      header: 'High °F',
    },
    {
      accessorKey: 'tempLow',
      header: 'Low °F',
    },
    {
      accessorKey: 'workPerformed',
      header: 'Work Performed',
      cell: ({ row }) => {
        const text = row.getValue('workPerformed') as string;
        return <div className="max-w-md truncate">{text}</div>;
      },
    },
    {
      accessorKey: 'manpower',
      header: 'Manpower',
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors: Record<string, string> = {
          draft: 'bg-gray-100 text-gray-700',
          submitted: 'bg-blue-100 text-blue-700',
          approved: 'bg-green-100 text-green-700',
        };
        return (
          <Badge className={statusColors[status] || 'bg-gray-100 text-gray-700'}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Log</h1>
          <p className="text-sm text-gray-500 mt-1">Track daily progress, weather, and manpower</p>
        </div>
        <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Log Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Entries</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{data.length}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Avg Manpower</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {Math.round(data.reduce((sum, item) => sum + item.manpower, 0) / data.length)}
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {data.filter(item => item.status === 'submitted').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <DataTable
          columns={columns}
          data={data}
          searchKey="workPerformed"
          searchPlaceholder="Search daily logs..."
        />
      </div>
    </div>
  );
}
