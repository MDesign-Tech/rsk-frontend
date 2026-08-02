'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': '#f3f4f6',
          '--normal-text': '#1f2937',
          '--normal-border': '#d1d5db',
          '--success-bg': '#22c55e',
          '--success-text': '#ffffff',
          '--success-border': '#16a34a',
          '--error-bg': '#ef4444',
          '--error-text': '#ffffff',
          '--error-border': '#dc2626',
          '--warning-bg': '#eab308',
          '--warning-text': '#1f2937',
          '--warning-border': '#ca8a04',
          '--info-bg': '#3b82f6',
          '--info-text': '#ffffff',
          '--info-border': '#2563eb',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
