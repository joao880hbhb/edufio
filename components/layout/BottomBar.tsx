import type { ReactNode } from "react"

export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10">
      <div className="mx-auto w-full max-w-md border-t border-edufio-gray-light bg-background px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        {children}
      </div>
    </div>
  )
}