'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { CommitmentForm } from '@/components/financial/commitments/commitment-form';
import { useFinancialStore } from '@/lib/stores/financial-store';
import { CommitmentFormData } from '@/lib/schemas/financial-schemas';

export default function NewCommitmentPage() {
  const router = useRouter();
  const { companies, addCommitment, setError } = useFinancialStore();

  const handleSubmit = async (data: CommitmentFormData) => {
    try {
      const response = await fetch('/api/commitments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create commitment');
      }

      const newCommitment = await response.json();
      addCommitment(newCommitment);
      router.push('/protected/financial/commitments');
    } catch (error: any) {
      setError('commitments', error.message);
      throw error; // Re-throw to be handled by the form
    }
  };

  const handleCancel = () => {
    router.push('/protected/financial/commitments');
  };

  // TODO: Replace with actual user data from auth context
  const mockUsers = [
    { id: '1', email: 'user1@example.com', full_name: 'John Doe', role: 'admin' as const, avatar_url: '' },
    { id: '2', email: 'user2@example.com', full_name: 'Jane Smith', role: 'project_manager' as const, avatar_url: '' },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Commitment</h1>
        <p className="text-muted-foreground">
          Create a new purchase order or subcontract
        </p>
      </div>

      <Card className="max-w-4xl">
        <div className="p-6">
          <CommitmentForm
            companies={companies}
            users={mockUsers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </Card>
    </div>
  );
}