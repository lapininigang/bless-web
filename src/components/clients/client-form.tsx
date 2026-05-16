'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientAction, updateClientAction } from '@/app/dashboard/clients/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ClientFormProps {
  initialData?: any
}

export function ClientForm({ initialData }: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const isEditing = !!initialData

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    
    try {
      const result = isEditing 
        ? await updateClientAction(initialData.id, formData)
        : await createClientAction(formData)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(isEditing ? 'Cliente actualizado' : 'Cliente creado exitosamente')
        router.push('/dashboard/clients')
        router.refresh()
      }
    } catch (error) {
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <p className="text-muted-foreground mt-2">
            Completa los detalles del cliente a continuación.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/clients">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre o Razón Social</Label>
          <Input 
            id="nombre" 
            name="nombre" 
            defaultValue={initialData?.nombre} 
            placeholder="Ej. Juan Pérez"
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input 
            id="telefono" 
            name="telefono" 
            defaultValue={initialData?.telefono} 
            placeholder="Ej. 809-555-5555"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input 
            id="direccion" 
            name="direccion" 
            defaultValue={initialData?.direccion} 
            placeholder="Ej. Av. Principal #123"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="balance_pendiente">Balance Pendiente Inicial</Label>
          <Input 
            id="balance_pendiente" 
            name="balance_pendiente" 
            type="number" 
            step="0.01" 
            min="0"
            defaultValue={initialData?.balance_pendiente ?? 0}
            disabled={isEditing} // Usually don't allow editing initial balance if there's transaction history, but for simplicity we keep it editable or disabled
          />
        </div>
      </div>
    </form>
  )
}
