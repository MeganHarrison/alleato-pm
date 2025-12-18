'use client';

// ✅ Client component because it uses hooks, router, state, etc.
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader, PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';

// ✅ This is the UI form component.
// It owns inputs + validation + onSubmit/onCancel calls.
import { ContractForm } from '@/components/domain/contracts';

// ✅ This is the TypeScript shape of what the form returns to you on submit.
// IMPORTANT: This is NOT your DB table schema.
import type { ContractFormData } from '@/components/domain/contracts/ContractForm';

export default function NewProjectContractPage() {
  const router = useRouter();

  // ✅ Pulls route params from URL: /[projectId]/contracts/new
  const params = useParams();

  // ✅ Derives the projectId the contract must be attached to.
  // This is how "every form must be assigned to a project" works.
  const projectId = parseInt(params.projectId as string, 10);

  // ✅ UI state only (spinner/disabled button)
  const [isSaving, setIsSaving] = useState(false);

  // ✅ This is the bridge: FORM MODEL -> API/DB MODEL
  // data is ContractFormData (form shape)
  // you map to the backend contract shape (snake_case fields etc)
  const handleSubmit = async (data: ContractFormData) => {
    setIsSaving(true);

    try {
      // ✅ This calls your Next.js API route.
      // The table is NOT identified here — the API route identifies it.
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // ✅ Field mapping happens RIGHT HERE.
        // Left side = API/DB field name
        // Right side = form field
        body: JSON.stringify({
          contract_number: data.number,
          title: data.title,
          status: data.status,

          // ✅ Convert string -> number for FK, or null if empty.
          client_id: data.contractCompanyId ? parseInt(data.contractCompanyId, 10) : null,

          // ✅ This is the critical project assignment.
          // Without this, your row is not tied to /24104/...
          project_id: projectId,

          // ⚠️ These are the fields you’re questioning.
          // They are being sent to the backend right now.
          original_contract_amount: data.originalAmount,
          revised_contract_amount: data.revisedAmount,
          retention_percentage: data.retentionPercent,

          // ✅ Derived field (business logic)
          executed: data.status === 'executed',

          private: data.isPrivate ?? false,

          // ⚠️ This looks suspicious: notes is being set to title
          // Probably should be: notes: data.notes (if you have it)
          notes: data.title,
        }),
      });

      // ✅ Handle API errors
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create contract');
      }

      // ✅ UX: success + redirect back to contracts list for that project
      toast.success('Prime contract created');
      router.push(`/${projectId}/contracts`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create contract');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Cancel just navigates away (no DB touch)
  const handleCancel = () => {
    router.push(`/${projectId}/contracts`);
  };

  // ✅ Default form values (form model, not DB model)
  const initialData: Partial<ContractFormData> = {
    number: '',
    title: '',
    status: 'draft',
    contractCompanyId: undefined,
    originalAmount: 0,
    retentionPercent: 10,
    isPrivate: false,
  };

  return (
    <>
      {/* ✅ Header chrome + breadcrumbs + back button */}
      <PageHeader
        title="Create Prime Contract"
        description="Set up the prime contract for this project, including owner, status, and financials."
        breadcrumbs={[
          { label: 'Projects', href: '/' },
          { label: 'Contracts', href: `/${projectId}/contracts` },
          { label: 'New Contract' },
        ]}
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <PageContainer>
        {/* ✅ The form renders inputs and calls handleSubmit with ContractFormData */}
        <ContractForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSaving}
          mode="create"
        />
      </PageContainer>
    </>
  );
}
