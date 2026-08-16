import type { ReactNode } from "react"
import Link from "next/link"

export default function StepLayout({
  step,
  title,
  subtitle,
  backUrl,
  children,
}: {
  step?: number
  title: string
  subtitle?: string
  backUrl?: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background">
      <header className="border-b border-edufio-gray-light px-4 pb-4 pt-6">
        {step && (
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-edufio-teal text-xs font-bold text-white">
              {step}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Langkah {step} dari 4
            </span>
          </div>
        )}
        <h1 className="flex items-center text-xl font-bold gap-1.5">
          {backUrl && (
            <Link
              href={backUrl}
              className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-edufio-teal/5 -ml-1 text-edufio-teal transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
          )}
          <span>{title}</span>
        </h1>
        {subtitle && <p className="mt-0.5 text-sm text-zinc-500">{subtitle}</p>}
      </header>
      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>
    </div>
  )
}