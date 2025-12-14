'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EditableSummaryProps {
  summary: string
  onSave: (summary: string) => Promise<void>
}

export function EditableSummary({ summary, onSave }: EditableSummaryProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSummary, setEditedSummary] = useState(summary)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setEditedSummary(summary)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedSummary(summary)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(editedSummary)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save summary:', error)
      // Keep edit mode open on error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">SUMMARY</CardTitle>
            <div className="flex gap-1">
              {!isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-4 w-4 text-gray-600" />
                    <span className="sr-only">Edit summary</span>
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="sr-only">Toggle summary</span>
                    </Button>
                  </CollapsibleTrigger>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="sr-only">Save changes</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 text-red-600" />
                    <span className="sr-only">Cancel editing</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="min-h-[200px] text-sm"
                disabled={isSaving}
              />
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                {summary
                  .split('\n')
                  .filter(paragraph => paragraph.trim())
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph.trim()}</p>
                  ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
