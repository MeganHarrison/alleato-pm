'use client';

import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
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
import { ChangeOrder } from '@/types/financial';

export default function ChangeOrdersPage() {
  const router = useRouter();
  const [changeOrders] = useState<ChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, just set empty data to avoid errors
    setLoading(false);
  }, []);

  const getStatusBadgeVariant = (status: string): "success" | "warning" | "secondary" | "default" | "outline" | "destructive" | null | undefined => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'draft':
        return 'secondary';
      case 'executed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Change Orders</h1>
        <p className="text-muted-foreground">
          Manage contract change orders and modifications
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Pending Review</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Total Pending</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Approved</p>
        </Card>
        <Card className="p-6">
          <div className="text-2xl font-bold">$0.00</div>
          <p className="text-xs text-muted-foreground">Total Approved</p>
        </Card>
      </div>

      {/* Change Orders Table */}
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">All Change Orders</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => router.push('/change-orders/new')}>
                <Plus className="h-4 w-4 mr-2" />
                New Change Order
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading change orders...</p>
            </div>
          ) : changeOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No change orders found</p>
              <Button onClick={() => router.push('/change-orders/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first change order
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changeOrders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">{order.number}</TableCell>
                    <TableCell>{order.title}</TableCell>
                    <TableCell>{order.commitment?.title || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                    <TableCell>{order.executed_date || '-'}</TableCell>
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