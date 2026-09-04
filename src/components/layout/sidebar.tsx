"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Monitor, 
  Users, 
  Package, 
  Key, 
  ClipboardList, 
  ArrowRightLeft, 
  PowerOff, 
  AlertTriangle, 
  FileText, 
  History, 
  Settings 
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Computers', href: '/computers', icon: Monitor },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Software & Licenses', href: '/software-licenses', icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="group flex h-full w-[4.5rem] hover:w-64 flex-col border-r border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-xl text-card-foreground z-20 transition-all duration-300 ease-in-out overflow-hidden relative">
      <div className="flex h-16 items-center px-4 border-b whitespace-nowrap overflow-hidden">
        <div className="flex items-center justify-center w-10 h-10 shrink-0 bg-primary/10 rounded-xl mr-3">
          <Monitor className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          IT Asset Manager
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
        <nav className="space-y-2 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`) && item.href !== '/'
            return (
              <div
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`cursor-pointer flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/40' 
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground group-hover:hover:translate-x-1'
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {item.name}
                </span>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
