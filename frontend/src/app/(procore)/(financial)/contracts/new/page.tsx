'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/layout';
import { ContractForm } from '@/components/domain/contracts';
import type { ContractFormData } from '@/components/domain/contracts/ContractForm';

export default function NewPrimeContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ContractFormData) => {
    setLoading(true);
    try {
      // TODO: API call to create prime contract
      console.log('Creating prime contract:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to contracts list
      router.push('/contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/contracts');
  };

  // Initial data for a new contract
  const initialData: Partial<ContractFormData> = {
    number: '2',
    status: 'draft',
    isPrivate: true,
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