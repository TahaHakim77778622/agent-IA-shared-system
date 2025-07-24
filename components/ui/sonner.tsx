"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"
import React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const typeIcons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl shadow-2xl border-2 border-border px-4 py-3 flex items-center gap-3 animate-fade-in-up bg-background/95 text-foreground",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: { boxShadow: "0 8px 32px 0 rgba(0,0,0,0.15)", borderRadius: 16 },
      }}
      {...props}
    />
  )
}

export { Toaster }
