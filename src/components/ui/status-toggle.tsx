'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

function StatusToggle({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="status-toggle"
      className={cn(
        "peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border border-border/60",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/30",
        "focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",

        // Track - light mode unchecked
        "bg-zinc-300",
        // Track - dark mode unchecked
        "dark:bg-zinc-700", 
        // Track - checked state (both themes)
        "data-[state=checked]:bg-primary",
        "dark:data-[state=checked]:bg-primary",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="status-toggle-thumb"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full",
          "shadow-md",
          "transition-all duration-300 ease-out",

          // Thumb color - white works in both light and dark themes
          "bg-white",

          // Position
          "translate-x-0.5",
          "data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { StatusToggle }