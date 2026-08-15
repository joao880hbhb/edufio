import type { ReactNode } from "react"

export default function StepLayout({
  title,
  subtitle,
  progress,
  children,
}: {
  title: string
  subtitle?: string
  progress?: { current: number; total: number }
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <header className="px-4 pt-6">
        {progress && (
          <p className="text-sm text-zinc-500">
            {progress.current} dari {progress.total} sesi
          </p>
        )}
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </header>
      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
    </div>
  )
}