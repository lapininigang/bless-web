'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BlessLogo } from '@/components/shared/bless-logo'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/(auth)/actions'
import { useSettingsStore } from '@/store/settings-store'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart },
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Clientes', href: '/dashboard/clients', icon: Users },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background/50 backdrop-blur-xl">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border/50">
        <BlessLogo size={32} />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User / Footer Area */}
      <div className="border-t border-border/50 p-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
