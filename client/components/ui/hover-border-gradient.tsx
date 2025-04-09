"use client"
import type React from "react"
import { cn } from "@/lib/utils"

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType
    containerClassName?: string
    className?: string
  } & React.HTMLAttributes<HTMLElement>
>) {
  return (
    <Tag className={cn("inline-block", containerClassName)} {...props}>
      <div className={cn("text-white", className)}>{children}</div>
    </Tag>
  )
}
