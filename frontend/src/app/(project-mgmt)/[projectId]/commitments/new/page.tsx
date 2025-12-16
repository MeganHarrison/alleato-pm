'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { CommitmentForm } from '@/components/financial/commitments/commitment-form';
import { useFinancialStore } from '@/lib/stores/financial-store';
import { CommitmentFormData } from '@/lib/schemas/financial-schemas';

export default function NewProjectCommitmentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = parseInt(params.projectId as string, 10);
  const type = searchParams.get('type'); // 'subcontract' or 'purchase_order'

  const { companies, addCommitment, setError } = useFinancialStore();

  const handleSubmit = async (data: CommitmentFormData) => {
    try {
      // Ensure project ID is included in the data
      const commitmentData = {
        ...data,
        project_id: projectId,
      };

      const response = await fetch('/api/commitments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commitmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create commitment');
      }

      const newCommitment = await response.json();
      addCommitment(newCommitment);

      // Redirect back to project-scoped commitments page
      router.push(`/${projectId}/commitments`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError('commitments', errorMessage);
      throw error; // Re-throw to be handled by the form
    }
  };

  const handleCancel = () => {
    router.push(`/${projectId}/commitments`);
  };

  // TODO: Replace with actual user data from auth context
  const mockUsers = [
    { id: '1', email: 'user1@example.com', full_name: 'John Doe', role: 'admin' as const, avatar_url: '' },
    { id: '2', email: 'user2@example.com', full_name: 'Jane Smith', role: 'project_manager' as const, avatar_url: '' },
  ];

  const title = type === 'subcontract' ? 'New Subcontract' :
                type === 'purchase_order' ? 'New Purchase Order' :
                'New Commitment';

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Create a new {type === 'subcontract' ? 'subcontract' : type === 'purchase_order' ? 'purchase order' : 'commitment'} for this project
        </p>
      </div>

      <Card className="max-w-4xl">
        <div className="p-6">
          <CommitmentForm
            companies={companies}
            users={mockUsers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            defaultType={type as 'subcontract' | 'purchase_order' | undefined}
          />
        </div>
      </Card>
    </div>
  );
}
