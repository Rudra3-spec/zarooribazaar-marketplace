import * as React from "react"
import { cn } from "@/lib/utils"

interface BusinessBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark"
}

export function BusinessBackground({
  className,
  variant = "light",
  ...props
}: BusinessBackgroundProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10 overflow-hidden",
        variant === "dark" ? "bg-slate-950" : "bg-white",
        className
      )}
      {...props}
    >
      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,transparent,black)]",
          variant === "dark" && "bg-grid-slate-800/50"
        )}
      />
      
      {/* Gradient orbs */}
      <div
        className="absolute left-[--left] top-[--top] -z-10 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #2563EB 0deg, #3B82F6 180deg, #60A5FA 360deg)",
          "--left": "calc(50% - 300px)",
          "--top": "calc(50% - 300px)",
        } as React.CSSProperties}
      />
      
      {/* Abstract shapes */}
      <svg
        className={cn(
          "absolute right-0 top-0 -z-10 h-[500px] w-[500px] stroke-slate-200",
          variant === "dark" && "stroke-slate-800"
        )}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="business-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 40V.5H40" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#business-pattern)" />
        <circle cx="400" cy="100" r="50" strokeWidth="2" fill="none" />
        <path
          d="M400 100l-50-50M400 100l50-50M400 100l-50 50M400 100l50 50"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  )
}
