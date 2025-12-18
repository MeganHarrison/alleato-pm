'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader, PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ChangeEventForm } from '@/components/domain/change-events/ChangeEventForm';
import type { ChangeEventFormData } from '@/components/domain/change-events/ChangeEventForm';
import { useProjectChangeEvents } from '@/hooks/use-change-events';

export default function NewChangeEventPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.projectId as string, 10);

  const [isSaving, setIsSaving] = useState(false);
  const { createChangeEvent } = useProjectChangeEvents(projectId);

  const handleSubmit = async (data: ChangeEventFormData) => {
    setIsSaving(true);
    try {
      const result = await createChangeEvent({
        project_id: projectId,
        event_number: data.number,
        title: data.title,
        status: data.status,
        reason: data.changeReason || null,
        scope: data.scope || null,
        notes: data.notes || null,
      });

      if (!result) {
        throw new Error('Failed to create change event');
      }

      toast.success('Change event created successfully');
      router.push(`/${projectId}/change-events`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create change event');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${projectId}/change-events`);
  };

  const initialData: Partial<ChangeEventFormData> = {
    number: '',
    title: '',
    status: 'open',
  };

  return (
    <>
      <PageHeader
        title="Create Change Event"
        description="Document a potential change to the project scope, schedule, or budget."
        breadcrumbs={[
          { label: 'Projects', href: '/' },
          { label: 'Change Events', href: `/${projectId}/change-events` },
          { label: 'New Change Event' },
        ]}
        actions={
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.back()}
            className='gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Back
          </Button>
        }
      />

      <PageContainer>
        <ChangeEventForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSaving}
          mode='create'
          projectId={projectId}
        />
      </PageContainer>
    </>
  );
}
