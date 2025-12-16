'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectPageHeader } from '@/components/project-page-header'
import { PageContainer } from '@/components/layout/page-container'
import { SummaryCardsGrid, SummaryCard } from './summary-cards-grid'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FinancialPageLayoutProps {
  projectId: string
  projectName?: string
  title: string
  description: string
  createButtonLabel: string
  onCreateClick?: () => void
  createHref?: string
  summaryCards: SummaryCard[]
  children: ReactNode
  className?: string
  headerActions?: ReactNode
}

export function FinancialPageLayout({
  projectId,
  projectName,
  title,
  description,
  createButtonLabel,
  onCreateClick,
  createHref,
  summaryCards,
  children,
  className,
  headerActions
}: FinancialPageLayoutProps) {
  const router = useRouter()

  const handleCreateClick = () => {
    if (onCreateClick) {
      onCreateClick()
    } else if (createHref) {
      router.push(createHref)
    }
  }

  return (
    <>
      <ProjectPageHeader
        title={title}
        description={description}
        projectId={projectId}
        projectName={projectName}
        createButtonLabel={createButtonLabel}
        onCreateClick={handleCreateClick}
        additionalActions={headerActions}
      />
      
      <PageContainer className={cn("space-y-6", className)}>
        {/* Summary Cards */}
        <SummaryCardsGrid cards={summaryCards} />
        
        {/* Main Content */}
        <Card className="p-6">
          {children}
        </Card>
      </PageContainer>
    </>
  )
}