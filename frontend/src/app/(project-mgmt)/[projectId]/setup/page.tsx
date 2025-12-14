import { ProjectSetupWizard } from "@/components/project-setup-wizard/project-setup-wizard"

interface ProjectSetupPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectSetupPage({ params }: ProjectSetupPageProps) {
  const { projectId } = await params
  return <ProjectSetupWizard projectId={projectId} />
}