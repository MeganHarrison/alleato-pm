'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/layout';
import { ContractForm } from '@/components/domain/contracts';
import type { ContractFormData } from '@/components/domain/contracts/ContractForm';

interface Contract {
  id: string;
  contract_number: string;
  title?: string;
  client_id: number | null;
  project_id: number | null;
  status: string;
  original_contract_amount: number | null;
  revised_contract_amount: number | null;
  retention_percentage: number | null;
  executed: boolean | null;
  private: boolean | null;
  notes: string | null;
  client?: { id: number; name: string | null } | null;
  project?: { id: number; name: string; project_number: string | null } | null;
}

export default function EditContractPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;

  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to fetch contract');
        }
        const data = await response.json();
        setContract(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contract');
      } finally {
        setIsLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const handleSubmit = async (data: ContractFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_number: data.number,
          title: data.title,
          client_id: data.contractCompanyId ? parseInt(data.contractCompanyId) : null,
          status: data.status,
          original_contract_amount: data.originalAmount,
          revised_contract_amount: data.revisedAmount,
          retention_percentage: data.retentionPercent,
          executed: data.status === 'executed',
          private: data.isPrivate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contract');
      }

      router.push('/contracts');
    } catch (err) {
      console.error('Error updating contract:', err);
      alert(err instanceof Error ? err.message : 'Failed to update contract');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/contracts');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h2 className="text-lg font-semibold text-red-600">Error Loading Contract</h2>
          <p className="text-muted-foreground mt-2">{error || 'Contract not found'}</p>
          <Button
            variant="outline"
            onClick={() => router.push('/contracts')}
            className="mt-4"
          >
            Back to Contracts
          </Button>
        </div>
      </PageContainer>
    );
  }

  const initialData: Partial<ContractFormData> = {
    number: contract.contract_number || '',
    title: contract.title || contract.notes || '',
    status: contract.status || 'draft',
    contractCompanyId: contract.client_id?.toString() || '',
    originalAmount: contract.original_contract_amount || 0,
    revisedAmount: contract.revised_contract_amount || undefined,
    retentionPercent: contract.retention_percentage || 10,
    isPrivate: contract.private || false,
  };

  return (
    <>
      <PageHeader
        title="Edit Contract"
        description={`Editing contract ${contract.contract_number}`}
        breadcrumbs={[
          { label: 'Financial', href: '/financial' },
          { label: 'Contracts', href: '/contracts' },
          { label: contract.contract_number || 'Edit' },
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

      <PageContainer>
        <ContractForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSaving}
          mode="edit"
        />
      </PageContainer>
    </>
  );
}
