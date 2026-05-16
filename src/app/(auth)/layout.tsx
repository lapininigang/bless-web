import type { ReactNode } from 'react'
import { BlessLogo } from '@/components/shared/bless-logo'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-12">
        <div className="max-w-md text-center">
          <BlessLogo size={64} className="justify-center mb-8" />
          <h1 className="text-3xl font-bold mb-4">Gestión inteligente para tu negocio</h1>
          <p className="text-muted-foreground text-lg">
            Controla productos, clientes, ventas e inventario en tiempo real. Todo en un solo lugar.
          </p>
        </div>
      </div>
      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <BlessLogo size={40} className="justify-center" />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}