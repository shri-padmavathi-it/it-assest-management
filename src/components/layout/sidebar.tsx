"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  Package, 
  Key, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  Building2,
  Building,
  Boxes
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  
  // Check if current route is within software licenses
  const isSoftwareActive = pathname.startsWith('/software-licenses') || pathname.startsWith('/softwares')
  
  // Check if current route is within computers
  const isComputersActive = pathname.startsWith('/computers')
  const [isABB, setIsABB] = useState(false)

  // State for accordion collapse / expand
  const [isSoftwareOpen, setIsSoftwareOpen] = useState(true)
  const [isComputersOpen, setIsComputersOpen] = useState(true)

  // Keep accordion open if user navigates to a software or computer route
  useEffect(() => {
    if (isSoftwareActive) {
      setIsSoftwareOpen(true)
    }
  }, [isSoftwareActive])

  useEffect(() => {
    if (isComputersActive) {
      setIsComputersOpen(true)
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search)
        setIsABB(urlParams.get("location")?.toLowerCase() === "abb")
      }
    }
  }, [isComputersActive, pathname])

  return (
    <aside className="group flex h-full w-[4.5rem] hover:w-64 flex-col border-r border-border/60 bg-card/70 backdrop-blur-xl text-card-foreground z-30 transition-all duration-300 ease-in-out overflow-x-hidden select-none shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-border/50 whitespace-nowrap overflow-hidden">
        <div className="flex items-center justify-center w-9 h-9 shrink-0 bg-primary/10 rounded-xl text-primary shadow-xs">
          <Monitor className="h-5 w-5" />
        </div>
        <div className="flex flex-col ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap overflow-hidden">
          <h1 className="text-base font-bold tracking-tight text-foreground leading-none">
            IT Asset Manager
          </h1>
          <span className="text-[11px] text-muted-foreground mt-1 font-medium">Enterprise Management</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-5 px-3 overflow-x-hidden">
        <nav className="space-y-1.5">
          {/* Dashboard */}
          <Link
            href="/"
            prefetch={true}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden ${
              pathname === '/'
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                pathname === '/'
                  ? 'bg-white/20 text-white'
                  : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
              Dashboard
            </span>
          </Link>

          {/* Computers Accordion */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setIsComputersOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                isComputersActive
                  ? 'bg-muted/60 text-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                    isComputersActive
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  <Monitor className="h-4 w-4 shrink-0" />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                  Computers
                </span>
              </div>
              <div
                className={`p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 delay-75 shrink-0 ${
                  isComputersOpen ? 'text-foreground' : 'text-muted-foreground/70'
                }`}
              >
                {isComputersOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>

            {/* Sub-menu with smooth expansion when accordion is open AND sidebar is hovered */}
            {isComputersOpen && (
              <div className="mt-1.5 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pl-3 overflow-hidden">
                {/* In-House SPC */}
                <Link
                  href="/computers?location=in-house"
                  onClick={() => setIsABB(false)}
                  prefetch={true}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                    isComputersActive && !isABB
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors ${
                      isComputersActive && !isABB
                        ? 'bg-white/20 text-white'
                        : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 whitespace-nowrap">In-House SPC</span>
                </Link>

                {/* ABB */}
                <Link
                  href="/computers?location=abb"
                  onClick={() => setIsABB(true)}
                  prefetch={true}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                    isComputersActive && isABB
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors ${
                      isComputersActive && isABB
                        ? 'bg-white/20 text-white'
                        : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <Building className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 whitespace-nowrap">ABB</span>
                </Link>
              </div>
            )}
          </div>

          {/* Employees */}
          <Link
            href="/employees"
            prefetch={true}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden ${
              pathname.startsWith('/employees')
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                pathname.startsWith('/employees')
                  ? 'bg-white/20 text-white'
                  : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
              Employees
            </span>
          </Link>

          {/* Softwares Accordion */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsSoftwareOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                isSoftwareActive
                  ? 'bg-muted/60 text-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                    isSoftwareActive
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}
                >
                  <Package className="h-4 w-4 shrink-0" />
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
                  Softwares
                </span>
              </div>
              <div
                className={`p-1 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 delay-75 shrink-0 ${
                  isSoftwareOpen ? 'text-foreground' : 'text-muted-foreground/70'
                }`}
              >
                {isSoftwareOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </button>

            {/* Sub-menu with smooth expansion when accordion is open AND sidebar is hovered */}
            {isSoftwareOpen && (
              <div className="mt-1.5 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pl-3 overflow-hidden">
                {/* Permanent Licenses */}
                <Link
                  href="/software-licenses/permanent"
                  prefetch={true}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/software-licenses/permanent'
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors ${
                      pathname === '/software-licenses/permanent'
                        ? 'bg-white/20 text-white'
                        : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <Key className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 whitespace-nowrap">Permanent Licenses</span>
                </Link>

                {/* Subscription Licenses */}
                <Link
                  href="/software-licenses/subscriptions"
                  prefetch={true}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                    pathname === '/software-licenses/subscriptions'
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors ${
                      pathname === '/software-licenses/subscriptions'
                        ? 'bg-white/20 text-white'
                        : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 whitespace-nowrap">Subscription Licenses</span>
                </Link>
              </div>
            )}
          </div>

          {/* Office Assets */}
          <Link
            href="/office-assets"
            prefetch={true}
            className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all whitespace-nowrap overflow-hidden ${
              pathname.startsWith('/office-assets')
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 font-semibold'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                pathname.startsWith('/office-assets')
                  ? 'bg-white/20 text-white'
                  : 'bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }`}
            >
              <Boxes className="h-4 w-4 shrink-0" />
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 whitespace-nowrap">
              Office Assets
            </span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
