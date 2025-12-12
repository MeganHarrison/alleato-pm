'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Grid3x3, List, Image as ImageIcon, Download, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Photo {
  id: string;
  title: string;
  location: string;
  takenBy: string;
  takenAt: string;
  tags: string[];
  thumbnail: string;
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    title: 'Foundation Pour - North Side',
    location: 'North Foundation',
    takenBy: 'John Smith',
    takenAt: '2025-12-10',
    tags: ['foundation', 'concrete'],
    thumbnail: 'https://via.placeholder.com/300x200?text=Foundation+Pour',
  },
  {
    id: '2',
    title: 'Second Floor Framing Progress',
    location: 'Floor 2',
    takenBy: 'Jane Doe',
    takenAt: '2025-12-09',
    tags: ['framing', 'progress'],
    thumbnail: 'https://via.placeholder.com/300x200?text=Framing+Progress',
  },
  {
    id: '3',
    title: 'HVAC Ductwork Installation',
    location: 'Floor 1 - Mechanical Room',
    takenBy: 'Mike Johnson',
    takenAt: '2025-12-08',
    tags: ['hvac', 'mep'],
    thumbnail: 'https://via.placeholder.com/300x200?text=HVAC+Installation',
  },
  {
    id: '4',
    title: 'Electrical Rough-In Complete',
    location: 'Floor 2',
    takenBy: 'Sarah Wilson',
    takenAt: '2025-12-07',
    tags: ['electrical', 'mep'],
    thumbnail: 'https://via.placeholder.com/300x200?text=Electrical+Work',
  },
];

export default function PhotosPage() {
  const [photos, setPhotos] = React.useState<Photo[]>(mockPhotos);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photos</h1>
          <p className="text-sm text-gray-500 mt-1">Project photo documentation</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-gray-100' : ''}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-gray-100' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange))]/90">
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Photos</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{photos.length}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">This Week</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {photos.filter(p => new Date(p.takenAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{photo.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{photo.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  {photo.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{photo.takenBy}</span>
                  <span>{new Date(photo.takenAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="divide-y">
            {photos.map((photo) => (
              <div key={photo.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{photo.title}</h3>
                    <p className="text-sm text-gray-500">{photo.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {photo.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-gray-500">
                    <div>{photo.takenBy}</div>
                    <div>{new Date(photo.takenAt).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
