'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PrimeContractForm,
  type PrimeContractFormValues,
  formatDateForSupabase,
} from '@/components/domain/contracts';
import { createClient } from '@/lib/supabase/client';

export default function NewProjectContractPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.push(`/${projectId}/contracts`);
  };

  const handleSubmit = async (values: PrimeContractFormValues) => {
    if (!projectId) {
      toast.error('Project ID is required to create a prime contract.');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: contract, error } = await supabase
        .from('prime_contracts')
        .insert({
          project_id: projectId,
          contract_number: values.contractNumber,
          title: values.title,
          owner_client_id: values.ownerClientId,
          contractor_id: values.contractorId,
          architect_engineer_id: values.architectEngineerId,
          status: values.status,
          executed: values.executed,
          is_private: values.isPrivate,
          allow_sov_visibility_for_allowed_users: values.allowSovVisibilityForAllowedUsers,
          default_retainage_percent: values.defaultRetainagePercent,
          description_html: values.descriptionHtml,
          start_date: formatDateForSupabase(values.startDate) || null,
          estimated_completion_date: formatDateForSupabase(values.estimatedCompletionDate) || null,
          substantial_completion_date: formatDateForSupabase(values.substantialCompletionDate) || null,
          actual_completion_date: formatDateForSupabase(values.actualCompletionDate) || null,
          signed_contract_received_date: formatDateForSupabase(values.signedContractReceivedDate) || null,
          termination_date: formatDateForSupabase(values.terminationDate) || null,
          inclusions_html: values.inclusionsHtml,
          exclusions_html: values.exclusionsHtml,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (values.allowedUsers.length > 0 && contract?.id) {
        const { error: accessError } = await supabase
          .from('prime_contract_user_access')
          .insert(
            values.allowedUsers.map((userId) => ({
              prime_contract_id: contract.id,
              user_id: userId,
            }))
          );

        if (accessError) {
          throw accessError;
        }
      }

      toast.success('Prime contract created');
      router.push(`/${projectId}/contracts`);
    } catch (err) {
      console.error('Error creating prime contract:', err);
      toast.error('Failed to create prime contract. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Contracts
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Prime Contract</h1>
        <p className="text-muted-foreground">
          Complete the prime contract form to create it for this project.
        </p>
      </div>

      <Card className="max-w-5xl p-6">
        <PrimeContractForm
          projectId={projectId}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
