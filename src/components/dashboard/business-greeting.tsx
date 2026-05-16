'use client'

import { useSettingsStore } from '@/store/settings-store'

export function BusinessGreeting() {
  const businessName = useSettingsStore((s) => s.businessName)

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{businessName}</h1>
      <p className="text-muted-foreground mt-2">
        Resumen de tu negocio en tiempo real.
      </p>
    </div>
  )
}
