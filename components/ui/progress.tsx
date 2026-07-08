"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type ProgressContextValue = {
  value: number
}

const ProgressContext = React.createContext<ProgressContextValue>({ value: 0 })

function Progress({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const normalizedValue =
    typeof value === "number" ? Math.min(100, Math.max(0, value)) : 0

  const progressBar = (
    <ProgressPrimitive.Root
      data-slot="progress"
      className="relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted"
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )

  if (!children) {
    return React.cloneElement(progressBar, {
      className: cn(progressBar.props.className, className),
    })
  }

  return (
    <ProgressContext.Provider value={{ value: normalizedValue }}>
      <div className={cn("w-full", className)}>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          {children}
        </div>
        {progressBar}
      </div>
    </ProgressContext.Provider>
  )
}

function ProgressLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="progress-label"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: React.ComponentProps<"span">) {
  const { value } = React.useContext(ProgressContext)

  return (
    <span
      data-slot="progress-value"
      className={cn("tabular-nums", className)}
      {...props}
    >
      {Math.round(value)}%
    </span>
  )
}

export { Progress, ProgressLabel, ProgressValue }
