"use client"

import { Moon, Sun, User as UserIcon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"

export function Topbar({ user }: { user?: any }) {
  const { setTheme, theme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-xl px-6 text-card-foreground z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Breadcrumbs or page title could go here */}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 hover:bg-muted transition-colors"
          title="Toggle theme"
        >
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="hidden h-5 w-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-3 py-1.5 hover:bg-muted transition-colors cursor-pointer"
          >
            <UserIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{user?.name || "IT Admin"}</span>
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border border-border/50 bg-background/90 backdrop-blur-xl shadow-lg p-1 animate-in fade-in slide-in-from-top-2 z-50">
              <div className="px-2 py-1.5 text-xs text-muted-foreground break-all">
                {user?.email || "admin@example.com"}
              </div>
              <div className="h-px bg-border/50 my-1" />
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
