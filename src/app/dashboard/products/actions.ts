'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { productSchema } from '@/lib/validations/product'
import { revalidatePath } from 'next/cache'

export async function createProductAction(formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const raw = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    codigo: formData.get('codigo') as string,
    categoria: formData.get('categoria') as string,
    costo: formData.get('costo'),
    precio_venta: formData.get('precio_venta'),
    stock: formData.get('stock'),
    min_stock: formData.get('min_stock'),
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await (supabase as any).from('products').insert([{
    ...parsed.data,
    user_id: user.id
  }])

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/products')
  return { success: true }
}

export async function updateProductAction(id: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const raw = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    codigo: formData.get('codigo') as string,
    categoria: formData.get('categoria') as string,
    costo: formData.get('costo'),
    precio_venta: formData.get('precio_venta'),
    stock: formData.get('stock'),
    min_stock: formData.get('min_stock'),
  }

  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { error } = await (supabase as any)
    .from('products')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/products')
  return { success: true }
}

export async function deleteProductAction(id: string) {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'No autorizado' }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/products')
  return { success: true }
}
