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
          "absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]",
          variant === "dark" 
            ? "bg-[linear-gradient(to_right,transparent_0.5px,theme(colors.slate.950)_0.5px),linear-gradient(to_bottom,transparent_0.5px,theme(colors.slate.950)_0.5px)] bg-[size:24px_24px]" 
            : "bg-[linear-gradient(to_right,transparent_0.5px,theme(colors.gray.50)_0.5px),linear-gradient(to_bottom,transparent_0.5px,theme(colors.gray.50)_0.5px)] bg-[size:24px_24px]"
        )}
        style={{
          backgroundImage: variant === "dark"
            ? "linear-gradient(to right, rgba(255,255,255,0.05) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(255,255,255,0.05) 0.5px, transparent 0.5px)"
            : "linear-gradient(to right, rgba(0,0,0,0.05) 0.5px, transparent 0.5px), linear-gradient(to bottom, rgba(0,0,0,0.05) 0.5px, transparent 0.5px)"
        }}
      />

      {/* Professional Gradient Effect */}
      <div className="absolute -z-10 h-full w-full">
        <div
          className="absolute left-[--left] top-[--top] h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
          style={{
            background: variant === "dark"
              ? "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1), rgba(59, 130, 246, 0.2))"
              : "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1), rgba(59, 130, 246, 0.15))",
            "--left": "calc(20% - 250px)",
            "--top": "calc(50% - 250px)",
          } as React.CSSProperties}
        />
        <div
          className="absolute right-[--right] bottom-[--bottom] h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
          style={{
            background: variant === "dark"
              ? "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), rgba(37, 99, 235, 0.2))"
              : "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), rgba(37, 99, 235, 0.15))",
            "--right": "calc(30% - 200px)",
            "--bottom": "calc(30% - 200px)",
          } as React.CSSProperties}
        />
      </div>

      {/* Business-themed Decorative Elements */}
      <svg
        className={cn(
          "absolute right-0 top-0 -z-10 h-[600px] w-[600px]",
          variant === "dark" ? "stroke-slate-800/20" : "stroke-slate-200/50"
        )}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="business-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 48V.5H48" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#business-pattern)" />
        <circle cx="400" cy="100" r="64" strokeWidth="2" fill="none" />
        <path
          d="M400 36v128M336 100h128"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}