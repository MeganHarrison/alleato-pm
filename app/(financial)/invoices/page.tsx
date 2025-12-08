'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, just set empty data to avoid errors
    setLoading(false);
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'approved':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Manage project invoices and billing
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Total Billed</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Outstanding</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Paid This Month</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Overdue Invoices</p>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Invoices</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => router.push('/invoices/new')}>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-600">Error: {error}</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-muted-foreground mb-4">No invoices found</p>
              <Button onClick={() => router.push('/invoices/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first invoice
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.contract}</TableCell>
                    <TableCell>{invoice.billingPeriod}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{invoice.dueDate || '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}