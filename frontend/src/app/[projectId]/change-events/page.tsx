'use client';

import { useParams, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer, ProjectPageHeader, PageTabs } from '@/components/layout';

export default function ProjectChangeEventsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = parseInt(params.projectId as string, 10);

  return (
    <>
      <ProjectPageHeader
        title="Change Events"
        description="Track and manage potential change orders and cost impacts"
        actions={
          <Button
            size="sm"
            onClick={() => router.push(`/${projectId}/change-events/new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Change Event
          </Button>
        }
      />

      <PageTabs
        tabs={[
          { label: 'All Change Events', href: `/${projectId}/change-events` },
          { label: 'Pending', href: `/${projectId}/change-events?status=pending` },
          { label: 'Approved', href: `/${projectId}/change-events?status=approved` },
        ]}
      />

      <PageContainer className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No change events found</p>
            <Button onClick={() => router.push(`/${projectId}/change-events/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first change event
            </Button>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
