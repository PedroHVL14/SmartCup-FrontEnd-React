"use client"

import * as React from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertNotificationProps {
  message: string
  type: "success" | "error"
  isVisible: boolean
  onClose: () => void
}

export function AlertNotification({ message, type, isVisible, onClose }: AlertNotificationProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg p-4 shadow-md transition-all duration-300",
        type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-600" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
