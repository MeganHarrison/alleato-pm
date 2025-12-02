"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Plus, Settings2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Commitment {
  id: string
  number: string
  contractCompany: string
  title: string
  erpStatus: 'synced' | 'pending' | 'error'
  status: 'draft' | 'approved' | 'executed'
  executed: boolean
  ssovStatus: 'approved' | 'pending'
  originalAmount: number
  approvedChangeOrders: number
  revisedContractAmount: number
  pendingChangeOrders: number
  draftAmount: number
}

export function CommitmentsTable() {
  // This would come from your API/state management
  const commitments: Commitment[] = [
    {
      id: '1',
      number: 'SC-001',
      contractCompany: 'Deem, LLC',
      title: 'Electrical Contract',
      erpStatus: 'synced',
      status: 'approved',
      executed: true,
      ssovStatus: 'approved',
      originalAmount: 293174.53,
      approvedChangeOrders: 7500.00,
      revisedContractAmount: 300674.53,
      pendingChangeOrders: 0,
      draftAmount: 0
    },
    // Add more data as needed
  ]

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              className="pl-10 w-[300px]"
            />
          </div>
          <Button variant="outline">
            Filters
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Contract Company</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>ERP Status</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Executed</TableHead>
              <TableHead>SSOV Status</TableHead>
              <TableHead className="text-right">Original Amount</TableHead>
              <TableHead className="text-right">Approved Change Orders</TableHead>
              <TableHead className="text-right">Revised Contract Amount</TableHead>
              <TableHead className="text-right">Pending Change Orders</TableHead>
              <TableHead className="text-right">Draft</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commitments.map((commitment) => (
              <TableRow key={commitment.id}>
                <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">
                  {commitment.number}
                </TableCell>
                <TableCell>{commitment.contractCompany}</TableCell>
                <TableCell>{commitment.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    {commitment.erpStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={commitment.status === 'approved' ? 'text-green-600' : 'text-gray-600'}
                  >
                    {commitment.status}
                  </Badge>
                </TableCell>
                <TableCell>{commitment.executed ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={commitment.ssovStatus === 'approved' ? 'text-green-600' : 'text-yellow-600'}
                  >
                    {commitment.ssovStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(commitment.originalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(commitment.approvedChangeOrders)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(commitment.revisedContractAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(commitment.pendingChangeOrders)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(commitment.draftAmount)}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">•••</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Grand Totals */}
      <div className="flex justify-end">
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-600">Grand Totals</div>
          <div className="grid grid-cols-4 gap-8 mt-2">
            <div className="text-right">
              <div className="text-xs text-gray-500">Original</div>
              <div className="font-semibold">$525,409.06</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Approved COs</div>
              <div className="font-semibold">$631,440.22</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Revised</div>
              <div className="font-semibold">$1,156,849.28</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Pending</div>
              <div className="font-semibold">$0.00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utils function (add to your utils file)
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}