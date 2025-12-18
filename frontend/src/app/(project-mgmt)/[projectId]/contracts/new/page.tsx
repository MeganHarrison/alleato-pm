'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectPageHeader, PageContainer } from '@/components/layout';
import { ContractForm } from '@/components/domain/contracts';
import type { ContractFormData } from '@/components/domain/contracts/ContractForm';

export default function NewContractPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (data: ContractFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_number: data.number,
          title: data.title,
          project_id: parseInt(projectId),
          client_id: data.ownerClientId ? parseInt(data.ownerClientId) : null,
          owner_client_id: data.ownerClientId ? parseInt(data.ownerClientId) : null,
          contractor_id: data.contractorId ? parseInt(data.contractorId) : null,
          architect_engineer_id: data.architectEngineerId ? parseInt(data.architectEngineerId) : null,
          status: data.status,
          executed: data.executed,
          private: data.isPrivate,
          default_retainage: data.defaultRetainage,
          description: data.description,
          start_date: data.startDate?.toISOString().split('T')[0],
          estimated_completion_date: data.estimatedCompletionDate?.toISOString().split('T')[0],
          substantial_completion_date: data.substantialCompletionDate?.toISOString().split('T')[0],
          actual_completion_date: data.actualCompletionDate?.toISOString().split('T')[0],
          signed_contract_received_date: data.signedContractReceivedDate?.toISOString().split('T')[0],
          contract_termination_date: data.contractTerminationDate?.toISOString().split('T')[0],
          inclusions: data.inclusions,
          exclusions: data.exclusions,
          allowed_users: data.allowedUsers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create contract');
      }

      const newContract = await response.json();
      router.push(`/${projectId}/contracts/${newContract.id}`);
    } catch (err) {
      console.error('Error creating contract:', err);
      alert(err instanceof Error ? err.message : 'Failed to create contract');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${projectId}/contracts`);
  };

  const initialData: Partial<ContractFormData> = {
    number: '',
    title: '',
    status: 'draft',
    executed: false,
    isPrivate: false,
    defaultRetainage: 10,
  };

  return (
    <>
      <ProjectPageHeader
        title="New Prime Contract"
        description="Create a new prime contract for this project"
        breadcrumbs={[
          { label: 'Contracts', href: `/${projectId}/contracts` },
          { label: 'New Contract' },
        ]}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <PageContainer className="max-w-4xl">
        <ContractForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSaving}
          mode="create"
          projectId={projectId}
        />
      </PageContainer>
    </>
  );
}
