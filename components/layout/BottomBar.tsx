import type { ReactNode } from "react"

export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0">
      <div className="mx-auto w-full max-w-md border-t border-zinc-200 bg-background px-4 py-3">
        {children}
      </div>
    </div>
  )
}