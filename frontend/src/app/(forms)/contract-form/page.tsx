'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/layout';
import { ContractForm } from '@/components/domain/contracts';
import type { ContractFormData } from '@/components/domain/contracts/ContractForm';
import { useContracts } from '@/hooks/use-contracts';

export default function NewPrimeContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { createContract } = useContracts({ enabled: false });

  const handleSubmit = async (data: ContractFormData) => {
    setLoading(true);
    try {
      // Create contract in Supabase
      const contract = await createContract({
        contract_number: data.number,
        client_id: data.contractCompanyId ? parseInt(data.contractCompanyId) : 0,
        status: data.status,
        original_contract_amount: data.originalAmount,
        executed: data.status === 'executed',
        notes: data.title,
      });

      if (contract) {
        // Navigate back to contracts list on success
        router.push('/contracts');
      } else {
        throw new Error('Failed to create contract');
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/contracts');
  };

  // Initial data for a new contract
  const initialData: Partial<ContractFormData> = {
    number: '',
    status: 'draft',
    isPrivate: false,
    retentionPercent: 10,
  };

  return (
    <>
      <PageHeader
        title="Create Prime Contract"
        description="Set up a new prime contract for your project"
        breadcrumbs={[
          { label: 'Financial', href: '/financial' },
          { label: 'Contracts', href: '/contracts' },
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

      <PageContainer>
        <ContractForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={loading}
          mode="create"
        />
      </PageContainer>
    </>
  );
}