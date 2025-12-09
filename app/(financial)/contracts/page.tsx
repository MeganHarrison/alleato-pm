'use client';

import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PrimeContract } from '@/types/financial';

export default function ContractsPage() {
  const router = useRouter();
  const [contracts] = useState<PrimeContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, just set empty data to avoid errors
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prime Contracts</h1>
        <p className="text-muted-foreground">
          Manage prime contracts and owner agreements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Original Contract Amount</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Approved Change Orders</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Revised Contract Amount</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Balance to Finish</p>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Contracts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => router.push('/contracts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                New Contract
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading contracts...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No contracts found</p>
              <Button onClick={() => router.push('/contracts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first contract
              </Button>
            </div>
          ) : (
            <div>
              {/* Contract table will go here when we have data */}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
