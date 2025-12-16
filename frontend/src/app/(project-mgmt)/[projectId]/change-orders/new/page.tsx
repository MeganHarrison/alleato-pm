'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewProjectChangeOrderPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.projectId as string, 10);

  const handleCancel = () => {
    router.push(`/${projectId}/change-orders`);
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
          Back to Change Orders
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Change Order</h1>
        <p className="text-muted-foreground">
          Create a new change order for this project
        </p>
      </div>

      <Card className="max-w-4xl p-6">
        <p className="text-muted-foreground">
          Change order creation form will be implemented here.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Temporary: This page will contain the full change order creation form with project ID: {projectId}
        </p>
      </Card>
    </div>
  );
}
