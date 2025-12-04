'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { commitmentSchema, CommitmentFormData } from '@/lib/schemas/financial-schemas';
import { Company, User, Commitment } from '@/types/financial';

interface CommitmentFormProps {
  commitment?: Commitment;
  companies: Company[];
  users: User[];
  onSubmit: (data: CommitmentFormData) => Promise<void>;
  onCancel: () => void;
}

export function CommitmentForm({
  commitment,
  companies,
  users,
  onSubmit,
  onCancel,
}: CommitmentFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CommitmentFormData>({
    resolver: zodResolver(commitmentSchema),
    defaultValues: {
      number: commitment?.number || '',
      contract_company_id: commitment?.contract_company_id || '',
      title: commitment?.title || '',
      description: commitment?.description || '',
      status: commitment?.status || 'draft',
      original_amount: commitment?.original_amount || 0,
      accounting_method: commitment?.accounting_method || 'amount',
      retention_percentage: commitment?.retention_percentage,
      executed_date: commitment?.executed_date,
      start_date: commitment?.start_date,
      substantial_completion_date: commitment?.substantial_completion_date,
      vendor_invoice_number: commitment?.vendor_invoice_number,
      signed_received_date: commitment?.signed_received_date,
      assignee_id: commitment?.assignee_id,
      private: commitment?.private || false,
    },
  });

  const handleFormSubmit = async (data: CommitmentFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const vendorCompanies = companies.filter(
    (company) => company.type === 'vendor' || company.type === 'subcontractor'
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="number">Commitment Number*</Label>
          <Input
            id="number"
            {...register('number')}
            disabled={isSubmitting}
            placeholder="e.g., SC-001"
          />
          {errors.number && (
            <p className="text-sm text-red-600">{errors.number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_company_id">Contract Company*</Label>
          <Select
            value={watch('contract_company_id')}
            onValueChange={(value) => setValue('contract_company_id', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {vendorCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contract_company_id && (
            <p className="text-sm text-red-600">{errors.contract_company_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          {...register('title')}
          disabled={isSubmitting}
          placeholder="e.g., Electrical Subcontract"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          disabled={isSubmitting}
          placeholder="Provide additional details about the commitment..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="status">Status*</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value as any)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="executed">Executed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="original_amount">Original Amount*</Label>
          <Input
            id="original_amount"
            type="number"
            step="0.01"
            {...register('original_amount', { valueAsNumber: true })}
            disabled={isSubmitting}
            placeholder="0.00"
          />
          {errors.original_amount && (
            <p className="text-sm text-red-600">{errors.original_amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accounting_method">Accounting Method*</Label>
          <Select
            value={watch('accounting_method')}
            onValueChange={(value) => setValue('accounting_method', value as any)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="unit">Unit</SelectItem>
              <SelectItem value="percent">Percent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="retention_percentage">Retention Percentage</Label>
          <Input
            id="retention_percentage"
            type="number"
            step="0.01"
            max="100"
            {...register('retention_percentage', { valueAsNumber: true })}
            disabled={isSubmitting}
            placeholder="e.g., 10"
          />
          {errors.retention_percentage && (
            <p className="text-sm text-red-600">{errors.retention_percentage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor_invoice_number">Vendor Invoice Number</Label>
          <Input
            id="vendor_invoice_number"
            {...register('vendor_invoice_number')}
            disabled={isSubmitting}
            placeholder="e.g., INV-12345"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="executed_date">Executed Date</Label>
          <Input
            id="executed_date"
            type="date"
            {...register('executed_date')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            {...register('start_date')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="substantial_completion_date">Substantial Completion</Label>
          <Input
            id="substantial_completion_date"
            type="date"
            {...register('substantial_completion_date')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="signed_received_date">Signed Received Date</Label>
          <Input
            id="signed_received_date"
            type="date"
            {...register('signed_received_date')}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignee_id">Assignee</Label>
          <Select
            value={watch('assignee_id') || ''}
            onValueChange={(value) => setValue('assignee_id', value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="private"
          checked={watch('private')}
          onCheckedChange={(checked) => setValue('private', checked as boolean)}
          disabled={isSubmitting}
        />
        <Label htmlFor="private" className="text-sm font-normal">
          Mark as private (only visible to authorized users)
        </Label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {commitment ? 'Update' : 'Create'} Commitment
        </Button>
      </div>
    </form>
  );
}