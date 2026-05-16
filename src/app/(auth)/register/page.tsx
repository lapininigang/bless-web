'use client'

import { useActionState } from 'react'
import { registerAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import Link from 'next/link'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
      return await registerAction(formData)
    },
    null
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Crear cuenta</h2>
      <p className="text-muted-foreground mb-6">
        Registra tu negocio en Bless
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
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
            autoComplete="new-password"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {state.error}
          </p>
        )}

        {state?.success && (
          <p className="text-sm text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-md">
            {state.success}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O regístrate con
          </span>
        </div>
      </div>

      <GoogleAuthButton text="Registrarse con Google" />

      <p className="text-center text-sm text-muted-foreground mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
