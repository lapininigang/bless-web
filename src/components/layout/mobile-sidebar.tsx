'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { X, LayoutDashboard, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react'
import { BlessLogo } from '@/components/shared/bless-logo'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import { logoutAction } from '@/app/(auth)/actions'

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ventas', href: '/dashboard/sales', icon: ShoppingCart },
  { name: 'Productos', href: '/dashboard/products', icon: Package },
  { name: 'Clientes', href: '/dashboard/clients', icon: Users },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { mobileSidebarOpen, setMobileSidebar } = useUIStore()

  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[70] w-72 bg-background border-r border-border/50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-border/50">
              <BlessLogo size={28} />
              <button
                onClick={() => setMobileSidebar(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Nav */}
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebar(false)}
                      className={cn(
                        'group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200',
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

            {/* Footer */}
            <div className="border-t border-border/50 p-4">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
