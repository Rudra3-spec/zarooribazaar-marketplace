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
        variant === "dark" ? "bg-slate-950" : "bg-slate-50",
        className
      )}
      {...props}
    >
      {/* Dynamic Wave Pattern */}
      <div 
        className={cn(
          "absolute inset-0",
          variant === "dark" ? "opacity-10" : "opacity-5"
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/path%3E%3C/svg%3E")`
        }}
      />

      {/* Interactive Gradient Effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={cn(
            "absolute h-[800px] w-[800px] rounded-full transition-all duration-500 ease-in-out group-hover:scale-105",
            variant === "dark" ? "opacity-20" : "opacity-15"
          )}
          style={{
            background: variant === "dark"
              ? "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(36, 0, 255) 0deg, rgb(0, 135, 255) 67.5deg, rgb(108, 39, 157) 198.75deg, rgb(24, 38, 163) 251.25deg, rgb(54, 103, 196) 301.88deg, rgb(105, 30, 255) 360deg)"
              : "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(0, 110, 255) 0deg, rgb(59, 130, 246) 67.5deg, rgb(37, 99, 235) 198.75deg, rgb(29, 78, 216) 251.25deg, rgb(30, 64, 175) 301.88deg, rgb(17, 24, 39) 360deg)",
            filter: "blur(100px)"
          }}
        />
      </div>

      {/* Business Icons Pattern */}
      <svg
        className={cn(
          "absolute right-0 top-0 -z-10 h-[600px] w-[600px]",
          variant === "dark" ? "text-slate-800/30" : "text-slate-600/20"
        )}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="business-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path d="M30 0L60 30L30 60L0 30z" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#business-pattern)" />
      </svg>

      {/* Accent Lines */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 h-px",
          variant === "dark" ? "bg-gradient-to-r from-transparent via-slate-800 to-transparent" : "bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        )} 
      />
      <div 
        className={cn(
          "absolute bottom-0 left-0 top-0 w-px",
          variant === "dark" ? "bg-gradient-to-b from-transparent via-slate-800 to-transparent" : "bg-gradient-to-b from-transparent via-slate-200 to-transparent"
        )} 
      />
    </div>
  )
}