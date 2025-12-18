'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MeetingsTable } from '@/components/meetings/meetings-table'
import { EditMeetingModal } from '@/components/meetings/edit-meeting-modal'
import { Database } from '@/types/database'

type Meeting = Database['public']['Tables']['document_metadata']['Row']

interface MeetingsTableWrapperProps {
  meetings: Meeting[]
  projectId: string
}

export function MeetingsTableWrapper({ meetings, projectId }: MeetingsTableWrapperProps) {
  const router = useRouter()
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsEditModalOpen(true)
  }

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <MeetingsTable
        meetings={meetings}
        projectId={projectId}
        onEdit={handleEdit}
      />

      <EditMeetingModal
        meeting={selectedMeeting}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
