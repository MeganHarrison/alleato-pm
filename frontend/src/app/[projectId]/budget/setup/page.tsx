'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CostCode {
  id: string;
  description: string;
  division_id: string;
  division_title: string | null;
}

interface CostType {
  id: string;
  code: string;
  description: string;
}

interface SelectedBudgetLine {
  costCodeId: string;
  costTypeId: string;
  amount: number;
}

export default function BudgetSetupPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;

  const [loading, setLoading] = useState(false);
  const [costCodes, setCostCodes] = useState<CostCode[]>([]);
  const [costTypes, setCostTypes] = useState<CostType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Group cost codes by division
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set());
  const [selectedLines, setSelectedLines] = useState<Map<string, SelectedBudgetLine>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCostType, setSelectedCostType] = useState<string>('all');
  const [defaultAmount, setDefaultAmount] = useState<string>('0');

  // Load cost codes and cost types
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const supabase = createClient();

        const [codesRes, typesRes] = await Promise.all([
          supabase
            .from('cost_codes')
            .select('id, description, division_id, division_title')
            .order('division_id', { ascending: true })
            .order('id', { ascending: true }),
          supabase
            .from('cost_code_types')
            .select('id, code, description')
            .order('code', { ascending: true }),
        ]);

        if (codesRes.error) throw codesRes.error;
        if (typesRes.error) throw typesRes.error;

        setCostCodes(codesRes.data || []);
        setCostTypes(typesRes.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load cost codes and types');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Group cost codes by division
  const groupedCostCodes = costCodes.reduce((acc, code) => {
    const divisionKey = `${code.division_id} - ${code.division_title || 'No Division'}`;
    if (!acc[divisionKey]) {
      acc[divisionKey] = [];
    }
    acc[divisionKey].push(code);
    return acc;
  }, {} as Record<string, CostCode[]>);

  // Filter cost codes by search query
  const filteredDivisions = Object.entries(groupedCostCodes).filter(([division, codes]) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      division.toLowerCase().includes(query) ||
      codes.some(code =>
        code.id.toLowerCase().includes(query) ||
        code.description?.toLowerCase().includes(query)
      )
    );
  });

  const toggleDivision = (division: string) => {
    setExpandedDivisions(prev => {
      const next = new Set(prev);
      if (next.has(division)) {
        next.delete(division);
      } else {
        next.add(division);
      }
      return next;
    });
  };

  const toggleCostCodeSelection = (costCodeId: string, costTypeId: string) => {
    const key = `${costCodeId}-${costTypeId}`;
    setSelectedLines(prev => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.set(key, {
          costCodeId,
          costTypeId,
          amount: parseFloat(defaultAmount) || 0,
        });
      }
      return next;
    });
  };

  const selectAllInDivision = (codes: CostCode[], costTypeId: string) => {
    setSelectedLines(prev => {
      const next = new Map(prev);
      codes.forEach(code => {
        const key = `${code.id}-${costTypeId}`;
        if (!next.has(key)) {
          next.set(key, {
            costCodeId: code.id,
            costTypeId,
            amount: parseFloat(defaultAmount) || 0,
          });
        }
      });
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selectedLines.size === 0) {
      toast.error('Please select at least one cost code');
      return;
    }

    try {
      setLoading(true);

      const lineItems = Array.from(selectedLines.values()).map(line => ({
        costCodeId: line.costCodeId,
        costType: line.costTypeId,
        amount: line.amount.toString(),
        description: null,
        qty: null,
        uom: null,
        unitCost: null,
      }));

      const response = await fetch(`/api/projects/${projectId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineItems }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create budget lines');
      }

      toast.success(`Successfully created ${selectedLines.size} budget line(s)`);
      router.push(`/${projectId}/budget`);
    } catch (error) {
      console.error('Error creating budget lines:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create budget lines');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/${projectId}/budget`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Budget
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Budget Setup</h1>
                <p className="text-sm text-gray-600">
                  Select cost codes and types to add to your budget
                </p>
              </div>
            </div>
            <Button onClick={handleSubmit} disabled={loading || selectedLines.size === 0}>
              {loading ? 'Creating...' : `Create ${selectedLines.size} Budget Line${selectedLines.size !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Panel - Selection Controls */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Filters</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Cost Codes</Label>
                  <Input
                    id="search"
                    placeholder="Search by code or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="costType">Cost Type</Label>
                  <Select value={selectedCostType} onValueChange={setSelectedCostType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {costTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.code} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="defaultAmount">Default Amount</Label>
                  <Input
                    id="defaultAmount"
                    type="number"
                    placeholder="0.00"
                    value={defaultAmount}
                    onChange={(e) => setDefaultAmount(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Amount applied to newly selected items
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Lines:</span>
                  <span className="font-medium">{selectedLines.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">
                    ${Array.from(selectedLines.values())
                      .reduce((sum, line) => sum + line.amount, 0)
                      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Cost Code Selection */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold">Cost Codes by Division</h2>
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-4">
                {loadingData ? (
                  <div className="py-8 text-center text-gray-500">Loading cost codes...</div>
                ) : filteredDivisions.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No cost codes found matching your search
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDivisions.map(([division, codes]) => {
                      const isExpanded = expandedDivisions.has(division);
                      const displayedCostTypes = selectedCostType === 'all'
                        ? costTypes
                        : costTypes.filter(t => t.id === selectedCostType);

                      return (
                        <div key={division} className="border rounded-lg">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleDivision(division)}
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              <span className="font-medium">{division}</span>
                              <span className="text-sm text-gray-500">({codes.length} codes)</span>
                            </div>
                            {displayedCostTypes.length > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  selectAllInDivision(codes, displayedCostTypes[0].id);
                                }}
                              >
                                Select All
                              </Button>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="border-t p-3 space-y-2">
                              {codes.map(code => (
                                <div key={code.id} className="space-y-1">
                                  <div className="text-sm font-medium text-gray-700">
                                    {code.id} - {code.description}
                                  </div>
                                  <div className="ml-4 flex flex-wrap gap-2">
                                    {displayedCostTypes.map(type => {
                                      const key = `${code.id}-${type.id}`;
                                      const isSelected = selectedLines.has(key);

                                      return (
                                        <label
                                          key={type.id}
                                          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                                            isSelected
                                              ? 'border-brand bg-brand/5 text-brand'
                                              : 'border-gray-200 hover:border-gray-300'
                                          }`}
                                        >
                                          <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => toggleCostCodeSelection(code.id, type.id)}
                                          />
                                          <span className="font-medium">{type.code}</span>
                                          <span className="text-gray-600">- {type.description}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
