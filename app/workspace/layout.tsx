import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MrrKit Workspace',
  description: 'Your AI-powered development environment.',
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="workspace-layout">
      {children}
    </div>
  )
}
