'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'color-mix(in oklch, var(--popover) 85%, transparent)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'color-mix(in oklch, var(--success) 20%, transparent)',
          '--success-text': 'var(--success-foreground)',
          '--success-border': 'color-mix(in oklch, var(--success) 40%, transparent)',
          '--error-bg': 'color-mix(in oklch, var(--destructive) 20%, transparent)',
          '--error-text': 'var(--destructive-foreground)',
          '--error-border': 'color-mix(in oklch, var(--destructive) 40%, transparent)',
          '--warning-bg': 'color-mix(in oklch, var(--warning) 20%, transparent)',
          '--warning-text': 'var(--warning-foreground)',
          '--warning-border': 'color-mix(in oklch, var(--warning) 40%, transparent)',
          '--info-bg': 'color-mix(in oklch, var(--info) 20%, transparent)',
          '--info-text': 'var(--info-foreground)',
          '--info-border': 'color-mix(in oklch, var(--info) 40%, transparent)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
