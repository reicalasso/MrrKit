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
    <div className="min-h-screen h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30">
      {children}
    </div>
  )
}


