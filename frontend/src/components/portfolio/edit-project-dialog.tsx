'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Project } from '@/types/portfolio';

interface EditProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditProjectDialog({
  project,
  open,
  onOpenChange,
  onSuccess
}: EditProjectDialogProps) {
  const [formData, setFormData] = React.useState({
    name: project.name,
    jobNumber: project.jobNumber || '',
    client: project.client || '',
    startDate: project.startDate || '',
    state: project.state || '',
    phase: project.phase || '',
    estRevenue: project.estRevenue?.toString() || '',
    estProfit: project.estProfit?.toString() || '',
    category: project.category || '',
  });
  const [isSaving, setIsSaving] = React.useState(false);

  // Reset form when project changes or dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: project.name,
        jobNumber: project.jobNumber || '',
        client: project.client || '',
        startDate: project.startDate || '',
        state: project.state || '',
        phase: project.phase || '',
        estRevenue: project.estRevenue?.toString() || '',
        estProfit: project.estProfit?.toString() || '',
        category: project.category || '',
      });
    }
  }, [open, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Map camelCase fields to database column names (with spaces)
      const updatePayload = {
        name: formData.name,
        'job number': formData.jobNumber,
        client: formData.client,
        'start date': formData.startDate || null,
        state: formData.state,
        phase: formData.phase,
        'est revenue': formData.estRevenue ? parseFloat(formData.estRevenue) : null,
        'est profit': formData.estProfit ? parseFloat(formData.estProfit) : null,
        category: formData.category,
      };

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      toast.success('Project updated successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter project name"
              />
            </div>

            {/* Job Number */}
            <div>
              <Label htmlFor="jobNumber">Job Number</Label>
              <Input
                id="jobNumber"
                value={formData.jobNumber}
                onChange={(e) => setFormData({ ...formData, jobNumber: e.target.value })}
                placeholder="e.g., 24104"
              />
            </div>

            {/* Client */}
            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Client name"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            {/* State */}
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                placeholder="e.g., CA"
                maxLength={2}
              />
            </div>

            {/* Phase */}
            <div>
              <Label htmlFor="phase">Phase</Label>
              <Input
                id="phase"
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                placeholder="e.g., Current, Bid, Preconstruction"
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Project category"
              />
            </div>

            {/* Estimated Revenue */}
            <div>
              <Label htmlFor="estRevenue">Estimated Revenue ($)</Label>
              <Input
                id="estRevenue"
                type="number"
                value={formData.estRevenue}
                onChange={(e) => setFormData({ ...formData, estRevenue: e.target.value })}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            {/* Estimated Profit */}
            <div>
              <Label htmlFor="estProfit">Estimated Profit ($)</Label>
              <Input
                id="estProfit"
                type="number"
                value={formData.estProfit}
                onChange={(e) => setFormData({ ...formData, estProfit: e.target.value })}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
