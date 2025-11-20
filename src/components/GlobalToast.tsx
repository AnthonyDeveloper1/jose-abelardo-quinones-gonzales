"use client"
import { useEffect, useState } from "react"

interface Toast {
  type: "success" | "error" | "info"
  message: string
}

export default function GlobalToast() {
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setToast(e.detail)
      setTimeout(() => setToast(null), 4000)
    }
    window.addEventListener("toast", handler as EventListener)
    return () => window.removeEventListener("toast", handler as EventListener)
  }, [])

  if (!toast) return null

  let bg = "bg-gray-800"
  if (toast.type === "success") bg = "bg-green-600"
  if (toast.type === "error") bg = "bg-red-600"
  if (toast.type === "info") bg = "bg-blue-600"

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white text-lg font-semibold ${bg}`}
      style={{ minWidth: 250, maxWidth: 400 }}
    >
      {toast.message}
    </div>
  )
}
