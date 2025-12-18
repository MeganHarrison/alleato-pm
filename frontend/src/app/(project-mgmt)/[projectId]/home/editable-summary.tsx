'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
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
    <div className="border border-neutral-200 bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="px-8 py-6 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-500">
              Summary
            </h3>
            <div className="flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-brand transition-colors duration-200"
                    onClick={handleEdit}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                    <span className="sr-only">Edit summary</span>
                  </button>
                  <CollapsibleTrigger asChild>
                    <button type="button" className="inline-flex items-center text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors duration-200">
                      {isOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only">Toggle summary</span>
                    </button>
                  </CollapsibleTrigger>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium bg-brand text-white hover:bg-brand-dark transition-colors duration-200 disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    Save
                    <span className="sr-only">Save changes</span>
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors duration-200 disabled:opacity-50"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                    <span className="sr-only">Cancel editing</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-8 py-8">
            {isEditing ? (
              <Textarea
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="min-h-[240px] text-sm leading-relaxed border-neutral-300 focus:border-brand focus:ring-brand/20 font-light"
                disabled={isSaving}
              />
            ) : (
              <div className="text-sm text-neutral-700 leading-[1.75] space-y-4 font-light">
                {summary
                  .split('\n')
                  .filter(paragraph => paragraph.trim())
                  .map((paragraph) => (
                    <p key={paragraph.substring(0, 50)} className="text-neutral-800">
                      {paragraph.trim()}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
