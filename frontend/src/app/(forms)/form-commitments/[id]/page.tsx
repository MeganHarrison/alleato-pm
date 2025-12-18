'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CommitmentForm } from '@/components/financial/commitments/commitment-form';
import { useFinancialStore } from '@/lib/stores/financial-store';
import { CommitmentFormData } from '@/lib/schemas/financial-schemas';
import { Commitment } from '@/types/financial';
import { Loader2 } from 'lucide-react';

export default function EditCommitmentPage() {
  const router = useRouter();
  const params = useParams();
  const commitmentId = params.id as string;

  const { companies, updateCommitment, setError } = useFinancialStore();
  const [commitment, setCommitment] = useState<Commitment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitment = async () => {
      try {
        const response = await fetch(`/api/commitments/${commitmentId}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to fetch commitment');
        }
        const data = await response.json();
        setCommitment(data);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Failed to load commitment');
      } finally {
        setIsLoading(false);
      }
    };

    if (commitmentId) {
      fetchCommitment();
    }
  }, [commitmentId]);

  const handleSubmit = async (data: CommitmentFormData) => {
    try {
      const response = await fetch(`/api/commitments/${commitmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update commitment');
      }

      const updatedCommitment = await response.json();
      updateCommitment(commitmentId, updatedCommitment);
      router.push('/commitments');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError('commitments', errorMessage);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/commitments');
  };

  const mockUsers = [
    { id: '1', email: 'user1@example.com', full_name: 'John Doe', role: 'admin' as const, avatar_url: '' },
    { id: '2', email: 'user2@example.com', full_name: 'Jane Smith', role: 'project_manager' as const, avatar_url: '' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (loadError || !commitment) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-4xl p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600">Error Loading Commitment</h2>
            <p className="text-muted-foreground mt-2">{loadError || 'Commitment not found'}</p>
            <button
              onClick={() => router.push('/commitments')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to Commitments
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Commitment</h1>
        <p className="text-muted-foreground">
          Update commitment {commitment.number}
        </p>
      </div>

      <Card className="max-w-4xl">
        <div className="p-6">
          <CommitmentForm
            commitment={commitment}
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
