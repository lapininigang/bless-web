'use client'

import { Bell, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/store/ui-store'

export function Topbar() {
  const { setMobileSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-3 border-b border-border/50 bg-background/80 backdrop-blur-md px-3 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Toggle */}
      <button
        type="button"
        className="-m-2 p-2 text-muted-foreground lg:hidden hover:text-foreground transition-colors"
        onClick={() => setMobileSidebar(true)}
      >
        <span className="sr-only">Abrir menú</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-border/50 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Global Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Buscar
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 sm:text-sm"
            placeholder="Buscar productos, clientes o ventas..."
            type="search"
            name="search"
          />
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <span className="sr-only">Ver notificaciones</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border/50" aria-hidden="true" />

          {/* User Profile Mini */}
          <div className="flex items-center gap-x-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-sm font-medium text-primary">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
