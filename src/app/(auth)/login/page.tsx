'use client'

import { useActionState } from 'react'
import { loginAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import Link from 'next/link'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return await loginAction(formData)
    },
    null
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Iniciar sesión</h2>
      <p className="text-muted-foreground mb-6">
        Ingresa tu email y contraseña para acceder
      </p>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="•••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continúa con
          </span>
        </div>
      </div>

      <GoogleAuthButton />

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}
