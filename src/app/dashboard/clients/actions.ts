'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { clientSchema } from '@/lib/validations/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createClientAction(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const raw = {
    nombre: formData.get('nombre') as string,
    telefono: formData.get('telefono') as string,
    direccion: formData.get('direccion') as string,
    balance_pendiente: formData.get('balance_pendiente'),
  }

  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await (supabase as any).from('clients').insert([{
    nombre: parsed.data.nombre,
    telefono: parsed.data.telefono,
    direccion: parsed.data.direccion,
    balance_pendiente: parsed.data.balance_pendiente,
    user_id: user.id
  }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/clients')
  return { success: true }
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const raw = {
    nombre: formData.get('nombre') as string,
    telefono: formData.get('telefono') as string,
    direccion: formData.get('direccion') as string,
    balance_pendiente: formData.get('balance_pendiente'),
  }

  const parsed = clientSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await (supabase as any)
    .from('clients')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/clients')
  return { success: true }
}

export async function deleteClientAction(id: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/clients')
  return { success: true }
}
