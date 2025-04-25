"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Building2,
  Calculator,
  ClipboardList,
  Hammer,
  Home,
  Package,
  Settings,
  Warehouse,
} from "lucide-react"

const menuItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Proyek", href: "/proyek", icon: Building2 },
  { name: "AHSP", href: "/ahsp", icon: ClipboardList },
  { name: "Tukang", href: "/tukang", icon: Hammer },
  { name: "Material", href: "/material", icon: Package },
  { name: "RAB", href: "/rab", icon: Calculator },
  { name: "Laporan", href: "/laporan", icon: BarChart3 },
  { name: "Pengaturan", href: "/pengaturan", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Warehouse className="h-6 w-6" />
          <span>AHSP Manager</span>
        </Link>
      </div>
      <nav className="space-y-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
