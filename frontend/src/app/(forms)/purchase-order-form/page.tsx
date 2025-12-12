'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/layout';
import { PurchaseOrderForm } from '@/components/domain/contracts';
import { useCommitments } from '@/hooks/use-commitments';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { createCommitment } = useCommitments();

  const handleSubmit = async (data: {
    number: string;
    vendorId: string;
    projectId: string;
    status: string;
    amount: number;
    description: string;
  }) => {
    setLoading(true);
    try {
      // Create the purchase order in the commitments table
      const newCommitment = await createCommitment({
        number: data.number,
        title: data.description || `Purchase Order ${data.number}`,
        contract_company_id: data.vendorId,
        status: data.status || 'draft',
        type: 'purchase_order',
        original_amount: data.amount || 0,
      });

      if (newCommitment) {
        // Navigate back to commitments list
        router.push('/commitments');
      } else {
        alert('Failed to create purchase order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('An error occurred while creating the purchase order.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/commitments');
  };

  // Initial data for a new purchase order
  const initialData = {
    number: 'PO-005',
    status: 'draft',
  };

  return (
    <>
      <PageHeader
        title="Create Purchase Order"
        description="Set up a new purchase order for your project"
        breadcrumbs={[
          { label: 'Financial', href: '/financial' },
          { label: 'Commitments', href: '/commitments' },
          { label: 'New Purchase Order' },
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
        <PurchaseOrderForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={loading}
        />
      </PageContainer>
    </>
  );
}