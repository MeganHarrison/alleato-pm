'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageContainer } from '@/components/layout';
import { PurchaseOrderForm } from '@/components/domain/contracts';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      // TODO: API call to create purchase order
      console.log('Creating purchase order:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to commitments list
      router.push('/commitments');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order');
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