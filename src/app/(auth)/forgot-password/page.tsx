'use client'

import { useActionState } from 'react'
import { forgotPasswordAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
      return await forgotPasswordAction(formData)
    },
    null
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Recuperar contraseña</h2>
      <p className="text-muted-foreground mb-6">
        Te enviaremos un enlace para restablecer tu contraseña
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
          {isPending ? 'Enviando...' : 'Enviar enlace'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        <Link href="/login" className="text-primary hover:underline font-medium">
          Volver al inicio de sesión
        </Link>
      </p>
    </div>
  )
}
